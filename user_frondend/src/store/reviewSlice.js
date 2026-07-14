
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';


export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async ({ productId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reviews/product/${productId}`, { params });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
  }
);


export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    summary: {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    },
    pagination: {
      currentPage: 1,
      totalPages: 0,
    },
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  reducers: {
    clearReviews: (state) => {
      state.items = [];
      state.summary = { averageRating: 0, totalReviews: 0, ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reviews
      .addCase(fetchProductReviews.pending, (state) => { state.isLoading = true; })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.reviews;
        state.summary = action.payload.summary;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create Review
      .addCase(createReview.pending, (state) => { state.isSubmitting = true; })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Optionally push the new review to the list if they are on the product page
        if (action.payload.review) {
          state.items.unshift(action.payload.review);
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })
      
      // Delete Review
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.items = state.items.filter(review => review._id !== action.payload);
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;