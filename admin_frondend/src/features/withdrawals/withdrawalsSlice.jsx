import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  withdrawals: [],
  totalRecords: 0,
  currentPage: 1,
  totalPages: 1,
  listStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  listError: null,

  filters: {
    search: "",
    status: "All", // All | Pending | Approved | Rejected | Paid
    sort: "newest", // newest | oldest | amount-asc | amount-desc
    page: 1,
    limit: 10,
  },

  // returned alongside the list ("cards")
  summary: {
    totalRequests: 0,
    pending: 0,
    approved: 0,
    paid: 0,
    totalPaidAmount: 0,
  },

  // detail page
  selectedSeller: null,
  selectedWithdrawal: null,
  bankDetails: null,
  earningsSummary: null,
  detailStatus: "idle",
  detailError: null,

  actionStatus: "idle", // approve / reject / pay
  actionError: null,
};

export const fetchWithdrawals = createAsyncThunk(
  "withdrawals/fetchWithdrawals",
  async (params, { rejectWithValue }) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([key, value]) => value !== "" && !(key === "status" && value === "All")
        )
      );
      const response = await api.get("/admin/withdrawals", {
        params: cleanParams,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load withdrawals"
      );
    }
  }
);

export const fetchWithdrawalById = createAsyncThunk(
  "withdrawals/fetchWithdrawalById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/withdrawals/${id}`);
      return response.data; // { seller, withdrawal, bankDetails, earningsSummary }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load withdrawal"
      );
    }
  }
);

export const approveWithdrawal = createAsyncThunk(
  "withdrawals/approveWithdrawal",
  async ({ id, remarks }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/withdrawals/${id}/approve`, {
        remarks,
      });
      return response.data.withdrawal;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to approve withdrawal"
      );
    }
  }
);

export const rejectWithdrawal = createAsyncThunk(
  "withdrawals/rejectWithdrawal",
  async ({ id, remarks }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/withdrawals/${id}/reject`, {
        remarks,
      });
      return response.data.withdrawal;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reject withdrawal"
      );
    }
  }
);

export const payWithdrawal = createAsyncThunk(
  "withdrawals/payWithdrawal",
  async ({ id, transactionId, remarks }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/withdrawals/${id}/pay`, {
        transactionId,
        remarks,
      });
      return response.data.withdrawal;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark withdrawal as paid"
      );
    }
  }
);

const withdrawalsSlice = createSlice({
  name: "withdrawals",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedWithdrawal: (state) => {
      state.selectedSeller = null;
      state.selectedWithdrawal = null;
      state.bankDetails = null;
      state.earningsSummary = null;
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
      .addCase(fetchWithdrawals.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchWithdrawals.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.withdrawals = action.payload.withdrawals;
        state.totalRecords = action.payload.totalRecords;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.summary = action.payload.cards;
      })
      .addCase(fetchWithdrawals.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload || "Failed to load withdrawals";
      })

      // detail
      .addCase(fetchWithdrawalById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchWithdrawalById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedSeller = action.payload.seller;
        state.selectedWithdrawal = action.payload.withdrawal;
        state.bankDetails = action.payload.bankDetails;
        state.earningsSummary = action.payload.earningsSummary;
      })
      .addCase(fetchWithdrawalById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload || "Failed to load withdrawal";
      })

      // approve / reject / pay all just replace the withdrawal in place
      .addCase(approveWithdrawal.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(approveWithdrawal.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.selectedWithdrawal = action.payload;
      })
      .addCase(approveWithdrawal.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload || "Failed to approve withdrawal";
      })

      .addCase(rejectWithdrawal.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(rejectWithdrawal.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.selectedWithdrawal = action.payload;
      })
      .addCase(rejectWithdrawal.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload || "Failed to reject withdrawal";
      })

      .addCase(payWithdrawal.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(payWithdrawal.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.selectedWithdrawal = action.payload;
      })
      .addCase(payWithdrawal.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError =
          action.payload || "Failed to mark withdrawal as paid";
      });
  },
});

export const { setFilters, clearSelectedWithdrawal, clearActionError } =
  withdrawalsSlice.actions;
export default withdrawalsSlice.reducer;