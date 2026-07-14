import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/reviews", { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

export const fetchReviewById = createAsyncThunk(
  "reviews/fetchReviewById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/reviews/${id}`);
      return response.data.review;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch review");
    }
  }
);

export const toggleReviewVisibility = createAsyncThunk(
  "reviews/toggleVisibility",
  async ({ id, action }, { rejectWithValue }) => {
    // action is either "hide" or "unhide"
    try {
      const response = await api.patch(`/admin/reviews/${id}/${action}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || `Failed to ${action} review`);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/reviews/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete review");
    }
  }
);

const initialState = {
  reviews: [],
  selectedReview: null,
  summary: {
    totalReviews: 0,
    fiveStarReviews: 0,
    hiddenReviews: 0,
    todaysReviews: 0,
  },
  totalPages: 1,
  filters: {
    page: 1,
    limit: 10,
    search: "",
    rating: "",
    status: "",
    sort: "newest",
  },
  listStatus: "idle",
  detailStatus: "idle",
  actionStatus: "idle",
  error: null,
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedReview: (state) => {
      state.selectedReview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchReviews.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.reviews = action.payload.reviews;
        state.summary = action.payload.cards;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })
      // Fetch Single
      .addCase(fetchReviewById.pending, (state) => {
        state.detailStatus = "loading";
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedReview = action.payload;
      })
      // Toggle Visibility
      .addCase(toggleReviewVisibility.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(toggleReviewVisibility.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        if (state.selectedReview && state.selectedReview._id === action.payload.review._id) {
          state.selectedReview.status = action.payload.review.status;
        }
        const index = state.reviews.findIndex((r) => r._id === action.payload.review._id);
        if (index !== -1) {
          state.reviews[index].status = action.payload.review.status;
        }
      })
      // Delete
      .addCase(deleteReview.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.reviews = state.reviews.filter((r) => r._id !== action.payload.id);
        if (state.selectedReview?._id === action.payload.id) {
          state.selectedReview = null;
        }
      });
  },
});

export const { setFilters, clearSelectedReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;