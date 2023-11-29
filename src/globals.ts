export type ModerationStatus = 'censoring' | 'validating' | 'skipping' | 'idle';

export type Channel = {
  id: string;
  name: string;
  description?: string;
};

export type Media = {
  id: string;
  title: string;
  category: string;
  channel: Channel;
  description?: string;
  embedURL: string;
  thumbnailURL: string;
  url: string;
};

export type MediaState = {
  media: Media;
  moderationStatus: ModerationStatus;
  moderationReason: string;
};

export const MEDIA_ACTION_TIMEOUT = 5000;
