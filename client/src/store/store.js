// src/store.js
import { configureStore } from '@reduxjs/toolkit';
// We will import our reducers here later
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    // Reducers go here
    auth : authReducer,
  },
});
