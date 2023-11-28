import { useEffect, useReducer, useState } from 'react';
import toast from 'react-hot-toast';

import ModerationControls from '../../components/controls/ModerationControls';
import MediaContainer from '../../components/media/MediaContainer';
import {
  ModerationStatus,
  Media,
  MediaAction,
  MediaReducerState,
  mediaStateInitalState,
  mediaRestApiURL,
} from '../../globals';
import MediaMetaDataContainer from '../../components/media/MediaMetaDataContainer';
import { useMutation, useQuery } from '@apollo/client';
import { GET_NEXT_TASK } from '../../graphql/queries';
import { CENSOR_MEDIA, VALIDATE_MEDIA } from '../../graphql/mutations';

const TIMEOUT = 5000;

const mediaReducer: React.Reducer<MediaReducerState, MediaAction> = (
  state: MediaReducerState,
  action: MediaAction
) => {
  if (action.type == 'setMedia' && action.value) {
    return {
      moderationStatus: state.moderationStatus,
      media: action.value as Media,
    };
  } else if (action.type == 'setStatus' && action.value) {
    return {
      media: state.media,
      moderationStatus: action.value as ModerationStatus,
    };
  }
  return state;
};

const ModerationPage = () => {
  const [mediaState, mediaDispatch] = useReducer(
    mediaReducer,
    mediaStateInitalState
  );

  const [title, setTitle] = useState('');

  const [reason, setReason] = useState('');

  const { error, data, refetch } = useQuery(GET_NEXT_TASK);

  const [censorMedia] = useMutation(CENSOR_MEDIA);
  const [validateMedia] = useMutation(VALIDATE_MEDIA);

  useEffect(() => {
    if (error) {
      toast.error('Something went wrong when fetching next media.');
      mediaDispatch({
        type: 'setStatus',
        value: 'idle',
      });
    }
  }, [error]);

  useEffect(() => {
    if (
      data &&
      data.moderation &&
      data.moderation.nextTask &&
      data.moderation.nextTask.media
    ) {
      mediaDispatch({
        type: 'setMedia',
        value: data.moderation.nextTask.media as Media,
      });
      mediaDispatch({
        type: 'setStatus',
        value: 'idle',
      });
    }
  }, [data]);

  // Retrieve video title via Rest API
  useEffect(() => {
    fetch(mediaRestApiURL(mediaState.media.id))
      .then((response) => response.json())
      .then((jsonResponse) => setTitle(jsonResponse.title))
      .catch(() => toast.error('Could not retrieve media title'));
  }, [mediaState.media.id]);

  // Don't forget to trim the reason

  const skip = () => {
    const timeout = setTimeout(() => {
      toast.error('Could not load next media');
      mediaDispatch({
        type: 'setStatus',
        value: 'idle',
      });
    }, TIMEOUT);
    refetch()
      .then(() => clearTimeout(timeout))
      .catch(() => clearTimeout(timeout));
    mediaDispatch({
      type: 'setStatus',
      value: 'skipping',
    });
  };

  const censor = () => {
    if (!reason || reason.length == 0) return;
    mediaDispatch({
      type: 'setStatus',
      value: 'censoring',
    });
    censorMedia({
      variables: {
        input: { id: mediaState.media.id, reason },
      },
    })
      .then(() => {
        mediaDispatch({
          type: 'setStatus',
          value: 'idle',
        });
        toast.success('Media successfully censored');
        setReason('');
        skip();
      })
      .catch(() => {
        mediaDispatch({
          type: 'setStatus',
          value: 'idle',
        });
        toast.error('Something went wrong when trying to censor this media');
      });
  };

  const validate = () => {
    if (!reason || reason.length == 0) return;
    mediaDispatch({
      type: 'setStatus',
      value: 'validating',
    });
    validateMedia({
      variables: {
        input: { id: mediaState.media.id, reason },
      },
    })
      .then(() => {
        mediaDispatch({
          type: 'setStatus',
          value: 'idle',
        });
        toast.success('Media successfully validated');
        setReason('');
        skip();
      })
      .catch(() => {
        mediaDispatch({
          type: 'setStatus',
          value: 'idle',
        });
        toast.error('Something went wrong when trying to validate this media');
      });
  };

  return (
    <div className="flex gap-4 p-6">
      <MediaMetaDataContainer
        category={mediaState.media.category}
        channelName={mediaState.media.channel.name}
        thumbnailURL={mediaState.media.thumbnailURL}
      />
      <MediaContainer
        title={title}
        description={mediaState.media.description}
        embedURL={mediaState.media.embedURL}
      />
      <ModerationControls
        censor={censor}
        validate={validate}
        skip={skip}
        reason={reason}
        setReason={setReason}
        status={mediaState.moderationStatus}
      />
    </div>
  );
};

export default ModerationPage;
