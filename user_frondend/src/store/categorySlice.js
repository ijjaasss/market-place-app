// src/store/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Async Thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/categories');
      // The API returns { success: true, count: X, data: [...] }
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch categories';
      return rejectWithValue(message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload; // action.payload is the array of categories
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;