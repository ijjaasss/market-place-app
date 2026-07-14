// src/store/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchWishlistCount = createAsyncThunk('wishlist/fetchCount', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/wishlist/count');
    return response.data.data; // { count }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist count');
  }
});
// Fetch the user's wishlist
export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/wishlist');
    return response.data.data; // { wishlistId, products: [{product: {...}, isAvailable: true}] }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
  }
});

// Remove an item from the wishlist
export const removeWishlistItem = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data.data; // Returns updated populated wishlist
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [], 
    count: 0,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
       .addCase(fetchWishlistCount.fulfilled, (state, action) => {
        state.count = action.payload.count || 0;
      })
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => { state.isLoading = true; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Remove Item
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        // The backend returns the updated wishlist upon deletion
        state.items = action.payload.products || [];
      });
  },
});

export default wishlistSlice.reducer;