import { TypedUseSelectorHook } from 'react-redux';
import { MediaState } from '../../globals';
import { vi } from 'vitest';

export const useAppSelector: TypedUseSelectorHook<{ media: MediaState }> = (
  selector
) => {
  return selector({
    media: {
      media: {
        title: '',
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
      moderationReason: '',
    },
  });
};

export const useAppDispatch = vi.fn();
