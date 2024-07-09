

import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  isAuthenticated: false,
  adminId: '',
  email: '',
  error: null,
};

// Create a slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.adminId = action.payload.adminId;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      state.error = null;
    },
    adminLogout: (state) => {
      state.adminId = '';
      state.email = '';
      state.isAuthenticated = false;
    },
  },
});

// Export actions
export const { setAdmin, adminLogout } = adminSlice.actions;

// Export reducer
export default adminSlice.reducer;



