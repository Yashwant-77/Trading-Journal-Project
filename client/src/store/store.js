import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'
import tradesReducer from './tradesSlice'
import playbookReducer from "./playbooksSlice";

export const store = configureStore({
  reducer: {
    // Reducers go here
    auth: authReducer,
    trades: tradesReducer,
    playbooks: playbookReducer,
  },
});
