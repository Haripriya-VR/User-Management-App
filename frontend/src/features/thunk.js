// src/features/thunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setUser, logout } from './userSlice';
import { setAdmin, adminLogout } from './adminSlice';
import { BACKEND_BASE_URL } from '../constants/constant';
import { useNavigate } from 'react-router-dom';

export const userSignup = createAsyncThunk(
  'user/signup',
  async ({ userName, email, password }, { dispatch, rejectWithValue }) => {
    try {
      const credentials = { userName, email, password };
      const response = await axios.post(`${BACKEND_BASE_URL}/sign-up`, credentials, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (response.data.success) {
        const userId = response?.data?.userId;
        console.log(userId ,'user id here ');
        const name = response?.data?.userName;
        console.log(name);
        dispatch(setUser({ userId, name }));

        return { success: true };
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const userLogin = createAsyncThunk(
  'user/login',
  async ({ email, password }, { dispatch, rejectWithValue ,navigate}) => {
    try {
      const credentials = { email, password };
      const response = await axios.post(`${BACKEND_BASE_URL}/login`, credentials, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (response.data.success) {
        const id = response?.data?.id
        console.log('id in logiin',id);
        const userName = response?.data?.userName
        console.log('name in login',userName);

        dispatch(setUser({ userId: id,name: userName }));
        navigate('/home')
        return { success: true };


      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const userLogout = createAsyncThunk(
  'user/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axios.get(`${BACKEND_BASE_URL}/logout`, { withCredentials: true });
      dispatch(logout());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const userProfileUpdate = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, userName, email, image }, { rejectWithValue }) => {
    try {
      const credentials = new FormData();
      credentials.append('profilephoto', image);
      credentials.append('userId', userId);
      credentials.append('userName', userName);
      credentials.append('email', email);
      

      const response = await axios.post(`${BACKEND_BASE_URL}/update-profile`, credentials, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (response.data.success) {
        return response.data.updatedUser;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const adminLogin = createAsyncThunk(
  'admin/login',
  async ({ email, password, navigate, setErrorMessage }, { dispatch, rejectWithValue }) => {
    try {
      const credentials = { email, password };
      const response = await axios.post(`${BACKEND_BASE_URL}/admin/adminlogin`, credentials, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (response.data.success) {
        const { _id, email } = response.data.adminData;
        dispatch(setAdmin({ adminId: _id, email }));
        navigate('/admin/dashboard');
        return { success: true };
      } else {
        setErrorMessage(response.data.message);
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
      return rejectWithValue(error.message);
    }
  }
);



// export const performAdminLogout = createAsyncThunk(
//   'admin/performLogout',
//   async (navigate, { dispatch }) => {
//     dispatch(adminLogout());

//     navigate('/admin/adminlogin');
//   }
// )

export const performAdminLogout = createAsyncThunk(
  'admin/performLogout',
  async (navigate, { dispatch, rejectWithValue }) => {
    try {
      await axios.get(`${BACKEND_BASE_URL}/admin/logout`, {
        withCredentials: true,
      });
      dispatch(adminLogout());
      navigate('/admin/adminlogin', { replace: true });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
