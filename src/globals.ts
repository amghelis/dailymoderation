export type ModerationStatus = 'censoring' | 'validating' | 'skipping' | 'idle';

export type Channel = {
  id: string;
  name: string;
  description?: string;
};

export type Media = {
  id: string;
  category: string;
  channel: Channel;
  description?: string;
  embedURL: string;
  thumbnailURL: string;
  url: string;
};

export type MediaReducerState = {
  media: Media;
  moderationStatus: ModerationStatus;
};

export const mediaStateInitalState: MediaReducerState = {
  media: {
    category: '',
    channel: {
      id: '',
      name: '',
    },
    embedURL: '',
    id: '',
    thumbnailURL: '',
    url: '',
    description: '',
  },
  moderationStatus: 'idle',
};

export type MediaAction = {
  type: 'setMedia' | 'setStatus';
  value: Media | ModerationStatus;
};

export const mediaRestApiURL = (mediaId: string) => {
  return `https://api.dailymotion.com/video/${mediaId}?fields=title`;
};
