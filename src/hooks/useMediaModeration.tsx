import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { actions } from '../redux/mediaSlice';
import { MEDIA_ACTION_TIMEOUT } from '../globals';
import { mediaRestApiURL } from '../utils/utils';
import toast from 'react-hot-toast';
import { GET_NEXT_TASK } from '../graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import { CENSOR_MEDIA, VALIDATE_MEDIA } from '../graphql/mutations';

const useMediaModeration = () => {
  const { data, refetch } = useQuery(GET_NEXT_TASK);

  const [censorMedia] = useMutation(CENSOR_MEDIA);
  const [validateMedia] = useMutation(VALIDATE_MEDIA);

  const mediaState = useAppSelector((state) => state.media);
  const mediaDispatch = useAppDispatch();

  useEffect(() => {
    if (
      data &&
      data.moderation &&
      data.moderation.nextTask &&
      data.moderation.nextTask.media
    ) {
      fetch(mediaRestApiURL(data.moderation.nextTask.media.id))
        .then((response) => response.json())
        .then((jsonResponse) => {
          mediaDispatch(
            actions.setMedia({
              ...data.moderation.nextTask.media,
              title: jsonResponse.title,
            })
          );
        })
        .catch(() => {
          mediaDispatch(
            actions.setMedia({
              ...data.moderation.nextTask.media,
              title: 'No Title',
            })
          );
        });
    }
  }, [data, mediaDispatch]);

  const _runActionTimeout = (errorMessage: string) => {
    return setTimeout(() => {
      toast.error(errorMessage);
      mediaDispatch(actions.setModerationStatus('idle'));
    }, MEDIA_ACTION_TIMEOUT);
  };

  const _resetTimeoutAndStatus = (timeout: NodeJS.Timeout) => {
    clearTimeout(timeout);
    mediaDispatch(actions.setModerationStatus('idle'));
  };

  const _resetReason = () => mediaDispatch(actions.setModerationReason(''));

  const skip = () => {
    mediaDispatch(actions.setModerationStatus('skipping'));
    const timeout = _runActionTimeout(
      'Could not fetch next media, the server has timed out.'
    );
    refetch()
      .then(() => {
        _resetTimeoutAndStatus(timeout);
      })
      .catch(() => {
        _resetTimeoutAndStatus(timeout);
        toast.error('An error has occured when trying to fetch next media.');
      });
  };

  const censor = () => {
    mediaDispatch(actions.setModerationStatus('censoring'));
    const timeout = _runActionTimeout(
      'Could not censor media, the server has timed out'
    );
    censorMedia({
      variables: {
        input: { id: mediaState.media.id, reason: mediaState.moderationReason },
      },
    })
      .then(() => {
        _resetTimeoutAndStatus(timeout);
        _resetReason();
        skip();
        toast.success('Successfully censored media');
      })
      .catch(() => {
        _resetTimeoutAndStatus(timeout);
        toast.error('An error has occured when trying to censor media');
      });
  };

  const validate = () => {
    mediaDispatch(actions.setModerationStatus('validating'));
    const timeout = _runActionTimeout(
      'Could not validate media, the server has timed out'
    );
    validateMedia({
      variables: {
        input: { id: mediaState.media.id, reason: mediaState.moderationReason },
      },
    })
      .then(() => {
        _resetTimeoutAndStatus(timeout);
        _resetReason();
        skip();
        toast.success('Successfully validated media');
      })
      .catch(() => {
        _resetTimeoutAndStatus(timeout);
        toast.error('An error has occured when trying to validate media');
      });
  };

  return {
    media: mediaState.media,
    moderationStatus: mediaState.moderationStatus,
    moderationReason: mediaState.moderationReason,
    skip,
    censor,
    validate,
  };
};

export default useMediaModeration;
