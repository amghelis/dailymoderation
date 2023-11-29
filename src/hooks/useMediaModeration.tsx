import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { actions } from '../redux/mediaSlice';
import { MEDIA_ACTION_TIMEOUT } from '../globals';
import { mediaRestApiURL } from '../utils/utils';
import toast from 'react-hot-toast';
import { GET_NEXT_TASK } from '../graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import { CENSOR_MEDIA, VALIDATE_MEDIA } from '../graphql/mutations';

/**
 * Custom hook for managing media moderation.
 *
 * This hook integrates with GraphQL for data fetching and mutations,
 * Redux for state management, and a REST API for additional media title retrieval.
 * It provides functionality for skipping, censoring, and validating media.
 *
 * @returns {Object} An object containing the following properties:
 *   - media: The current media object from the Redux state, containing media details.
 *   - moderationStatus: The current status of media moderation, such as 'idle', 'skipping', 'censoring', 'validating'.
 *   - moderationReason: The reason for the current moderation action, if any.
 *   - skip: Function to skip the current media and fetch the next media.
 *   - censor: Function to censor the current media.
 *   - validate: Function to validate the current media.
 *
 */
const useMediaModeration = () => {
  const { data, refetch } = useQuery(GET_NEXT_TASK);

  const [censorMedia] = useMutation(CENSOR_MEDIA);
  const [validateMedia] = useMutation(VALIDATE_MEDIA);

  const mediaState = useAppSelector((state) => state.media);
  const mediaDispatch = useAppDispatch();

  // Effect to fetch additional media information when new data is received from GET_NEXT_TASK query
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

  // Function to handle action timeout with a toast message
  const _runActionTimeout = (errorMessage: string) => {
    return setTimeout(() => {
      toast.error(errorMessage);
      mediaDispatch(actions.setModerationStatus('idle'));
    }, MEDIA_ACTION_TIMEOUT);
  };

  // Function to reset the action timeout and moderation status
  const _resetTimeoutAndStatus = (timeout: NodeJS.Timeout) => {
    clearTimeout(timeout);
    mediaDispatch(actions.setModerationStatus('idle'));
  };

  // Function to reset moderation reason
  const _resetReason = () => mediaDispatch(actions.setModerationReason(''));

  // Function to skip to the next media.
  const skip = () => {
    mediaDispatch(actions.setModerationStatus('skipping'));
    const timeout = _runActionTimeout(
      'Could not fetch next media, the server has timed out.'
    );
    refetch()
      .then(() => {
        // Reset timeout and status on successful refetch
        _resetTimeoutAndStatus(timeout);
      })
      .catch(() => {
        _resetTimeoutAndStatus(timeout);
        toast.error('An error has occured when trying to fetch next media.');
      });
  };

  // Function to censor the current media and skip to the next media.
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

  // Function to validate the current media and skip to the next media.
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
