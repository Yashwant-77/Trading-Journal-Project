
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playbooks: [],
};

const playbookSlice = createSlice({
  name: "playbooks",

  initialState,

  reducers: {
    // Replace all playbooks
    setPlaybooks: (state, action) => {
      state.playbooks = action.payload;
    },

    // Add a newly created playbook
    addPlaybook: (state, action) => {
      state.playbooks.unshift(action.payload);
    },

    // Update an existing playbook
    updatePlaybook: (state, action) => {
      const index = state.playbooks.findIndex(
        (playbook) => playbook._id === action.payload._id
      );

      if (index !== -1) {
        state.playbooks[index] = action.payload;
      }
    },

    // Remove a playbook
    removePlaybook: (state, action) => {
      state.playbooks = state.playbooks.filter(
        (playbook) => playbook._id !== action.payload
      );
    },

    // Clear playbooks
    clearPlaybooks: (state) => {
      state.playbooks = [];
    },
  },
});

export const {
  setPlaybooks,
  addPlaybook,
  updatePlaybook,
  removePlaybook,
  clearPlaybooks,
} = playbookSlice.actions;

export default playbookSlice.reducer;



