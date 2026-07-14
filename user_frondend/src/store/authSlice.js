// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { toast } from 'react-toastify';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/user/login', credentials);
    toast.success('Welcome back!');
    return response.data.data; // Returns the user object
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/user/register', userData);
    toast.success('Registration successful!');
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const checkAuth = createAsyncThunk('auth/check', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/user/me');
    return response.data.user; 
  } catch (error) {

    return rejectWithValue('Not authenticated');
  }
});


export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/user/logout');
    toast.success('Logged out successfully');
    return null;
  } catch (error) {
    toast.error('Logout failed');
    return rejectWithValue('Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: false,
    isCheckingAuth: true,
    error: null,
  },
  reducers: { },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; })
      .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // Register
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; })
      .addCase(registerUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.user = action.payload; 
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.user = null; 
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null; // Clear user state on successful logout
      });

  },
});


export default authSlice.reducer;