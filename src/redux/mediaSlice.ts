import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MediaState, Media, ModerationStatus } from '../globals';

const initialState: MediaState = {
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
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setMedia: (state, action: PayloadAction<Media>) => {
      state.media = action.payload;
    },
    setModerationStatus: (state, action: PayloadAction<ModerationStatus>) => {
      state.moderationStatus = action.payload;
    },
    setModerationReason: (state, action: PayloadAction<string>) => {
      state.moderationReason = action.payload;
    },
  },
});

export const actions = mediaSlice.actions;

export default mediaSlice.reducer;
