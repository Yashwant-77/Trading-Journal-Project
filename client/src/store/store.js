// src/store.js
import { configureStore } from '@reduxjs/toolkit';
// We will import our reducers here later
import authReducer from './authSlice'
import tradesReducer from './tradesSlice'

export const store = configureStore({
  reducer: {
    // Reducers go here
    auth : authReducer,
    trades : tradesReducer,
  },
});
