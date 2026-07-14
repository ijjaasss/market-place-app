import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  data: null, // full payload: stats, latestSellers, latestProducts, latestOrders, notifications, charts
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/dashboard");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load dashboard data"
      );
    }
  }
);

// status is "Accepted" or "Rejected"
export const updateSellerStatus = createAsyncThunk(
  "dashboard/updateSellerStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await api.patch(`/admin/sellers/${id}/status`, { status });
      return { id, status };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update seller status"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load dashboard data";
      })

      .addCase(updateSellerStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const seller = state.data?.latestSellers?.find((s) => s._id === id);
        if (seller) {
          const wasPending = seller.status === "Pending";
          seller.status = status;
          if (wasPending && status !== "Pending" && state.data.stats) {
            state.data.stats.pendingSellers = Math.max(
              0,
              state.data.stats.pendingSellers - 1
            );
          }
        }
      });
  },
});

export default dashboardSlice.reducer;