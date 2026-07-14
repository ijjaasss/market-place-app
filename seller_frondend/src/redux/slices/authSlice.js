import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Thunk for handling login
export const loginSeller = createAsyncThunk(
  'auth/loginSeller',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', credentials);
      // Backend returns the seller data inside response.data.data
      return response.data.data; 
    } catch (error) {
      // Passes the specific error message (like "Your account has been blocked") to the UI
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred during login'
      );
    }
  }
);

// Thunk for checking if the user is already logged in via cookie
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/me');
      // Backend returns the seller data inside response.data.seller
      return response.data.seller;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unauthorized');
    }
  }
);


export const registerSeller = createAsyncThunk(
  'auth/registerSeller',
  async (formData, { rejectWithValue }) => {
    try {

      const response = await api.post('/register', formData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred during registration'
      );
    }
  }
);

export const logoutSeller = createAsyncThunk(
  'auth/logoutSeller',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/logout'); // Calls the backend to clear the cookie
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: true, // Starts true to wait for checkAuth on mount
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginSeller.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginSeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginSeller.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Check Auth cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;