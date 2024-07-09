import { createSlice } from '@reduxjs/toolkit';
import { userLogin } from '../features/thunk'; 

// Initial state
const initialState = {
  isAuthenticated: false,
  userId: '',
  name: '',
  error: null,
};

// Create a slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.userId = '';
      state.name = '';
      state.isAuthenticated = false;
    },
  },
});

// Export actions
export const { setUser, logout } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
