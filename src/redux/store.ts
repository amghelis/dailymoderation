import { configureStore } from '@reduxjs/toolkit';
import mediaReducer from './mediaSlice';

const store = configureStore({
  reducer: {
    media: mediaReducer,
  },
});

// Following the documentation to create typing
// Check documentation : https://redux.js.org/tutorials/typescript-quick-start#project-setup
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
