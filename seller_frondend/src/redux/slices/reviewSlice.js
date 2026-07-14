import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (params, { rejectWithValue }) => {
    try {
      const { page = 1, search = '', rating = '', sort = 'newest' } = params;
      const { data } = await api.get(`/reviews?page=${page}&search=${search}&rating=${rating}&sort=${sort}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    cards: { totalReviews: 0, averageRating: 0, fiveStarReviews: 0, productsWithReviewed: 0 },
    totalPages: 1,
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => { state.isLoading = true; })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.reviews;
        state.cards = action.payload.cards;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchReviews.rejected, (state) => { state.isLoading = false; });
  },
});

export default reviewSlice.reducer;