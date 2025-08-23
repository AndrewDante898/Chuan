import { configureStore } from '@reduxjs/toolkit';
import searchFormReducer from './Reducers/SearchFormSlice'; // Adjust the path as needed

export const store = configureStore({
  reducer: {
    searchForm: searchFormReducer,
    // Add other reducers here
  },
});

// Types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
