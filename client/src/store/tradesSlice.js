import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trades: [],
  loading: false,
  error: null,
};

const tradesSlice = createSlice({
  name: "trades",
  initialState,
  reducers: {
    setTrades: (state, action) => {
      state.trades = action.payload;
    },

    addTrade: (state, action) => {
      state.trades.push(action.payload);
    },

    removeTrade: (state, action) => {
      state.trades = state.trades.filter(
        (trade) => trade._id !== action.payload
      );
    },

    clearTrades: (state) => {
      state.trades = [];
    },
  },
});

export const {
  setTrades,
  addTrade,
  removeTrade,
  clearTrades,
} = tradesSlice.actions;

export default tradesSlice.reducer;