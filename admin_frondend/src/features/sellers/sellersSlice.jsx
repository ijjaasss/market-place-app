import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  sellers: [],
  totalRecords: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  listStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  listError: null,

  filters: {
    search: "",
    status: "All", // All | Pending | Approved | Rejected
    sort: "newest", // newest | oldest | name | shop
    page: 1,
    limit: 10,
  },

  summary: { total: 0, pending: 0, approved: 0, blocked: 0 },
  summaryStatus: "idle",

  selectedSeller: null,
  detailStatus: "idle",
  detailError: null,

  actionStatus: "idle", // for approve/reject/block requests
  actionError: null,
};

export const fetchSellers = createAsyncThunk(
  "sellers/fetchSellers",
  async (params, { rejectWithValue }) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([key, value]) => value !== "" && !(key === "status" && value === "All")
        )
      );
      const response = await api.get("/admin/sellers", { params: cleanParams });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load sellers"
      );
    }
  }
);

// The list endpoint only supports status filtering (Pending/Approved/Rejected),
// not an isBlocked filter, and there's no dedicated stats endpoint. So for the
// summary cards we pull a large page and count client-side. Fine for a few
// hundred sellers; swap for a real /admin/sellers/stats endpoint if this ever
// needs to scale further.
export const fetchSellerSummary = createAsyncThunk(
  "sellers/fetchSellerSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/sellers", {
        params: { limit: 1000, page: 1 },
      });
      const sellers = response.data.sellers || [];
      const summary = sellers.reduce(
        (acc, s) => {
          acc.total += 1;
          if (s.status === "Pending") acc.pending += 1;
          if (s.status === "Approved") acc.approved += 1;
          if (s.isBlocked) acc.blocked += 1;
          return acc;
        },
        { total: 0, pending: 0, approved: 0, blocked: 0 }
      );
      return summary;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load seller summary"
      );
    }
  }
);

export const fetchSellerById = createAsyncThunk(
  "sellers/fetchSellerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/sellers/${id}`);
      return response.data.seller;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load seller"
      );
    }
  }
);

// status: "Approved" | "Rejected"
export const updateSellerStatus = createAsyncThunk(
  "sellers/updateSellerStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/sellers/${id}/status`, {
        status,
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update seller status"
      );
    }
  }
);

// toggles block <-> unblock, no body needed
export const toggleSellerBlock = createAsyncThunk(
  "sellers/toggleSellerBlock",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/sellers/${id}/block`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update seller block status"
      );
    }
  }
);

const sellersSlice = createSlice({
  name: "sellers",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedSeller: (state) => {
      state.selectedSeller = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
    clearActionError: (state) => {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchSellers.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchSellers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.sellers = action.payload.sellers;
        state.totalRecords = action.payload.totalRecords;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.limit = action.payload.limit;
      })
      .addCase(fetchSellers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload || "Failed to load sellers";
      })

      // summary
      .addCase(fetchSellerSummary.pending, (state) => {
        state.summaryStatus = "loading";
      })
      .addCase(fetchSellerSummary.fulfilled, (state, action) => {
        state.summaryStatus = "succeeded";
        state.summary = action.payload;
      })
      .addCase(fetchSellerSummary.rejected, (state) => {
        state.summaryStatus = "failed";
      })

      // detail
      .addCase(fetchSellerById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchSellerById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedSeller = action.payload;
      })
      .addCase(fetchSellerById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload || "Failed to load seller";
      })

      // status update
      .addCase(updateSellerStatus.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(updateSellerStatus.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const updated = action.payload;
        const idx = state.sellers.findIndex((s) => s._id === updated._id);
        const previousStatus = idx !== -1 ? state.sellers[idx].status : null;
        if (idx !== -1) state.sellers[idx] = updated;
        if (state.selectedSeller?._id === updated._id) {
          state.selectedSeller = updated;
        }
        // keep summary cards in sync without a full refetch
        if (previousStatus === "Pending") state.summary.pending -= 1;
        if (updated.status === "Approved") state.summary.approved += 1;
        if (previousStatus === "Approved" && updated.status !== "Approved") {
          state.summary.approved -= 1;
        }
      })
      .addCase(updateSellerStatus.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload || "Failed to update seller status";
      })

      // block/unblock
      .addCase(toggleSellerBlock.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(toggleSellerBlock.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const updated = action.payload;
        const idx = state.sellers.findIndex((s) => s._id === updated._id);
        if (idx !== -1) state.sellers[idx] = updated;
        if (state.selectedSeller?._id === updated._id) {
          state.selectedSeller = updated;
        }
        state.summary.blocked += updated.isBlocked ? 1 : -1;
      })
      .addCase(toggleSellerBlock.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError =
          action.payload || "Failed to update seller block status";
      });
  },
});

export const { setFilters, clearSelectedSeller, clearActionError } =
  sellersSlice.actions;
export default sellersSlice.reducer;