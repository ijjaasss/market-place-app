import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios'; // Adjust based on your axios setup

// Fetch earnings, stats, and withdrawal history
export const fetchEarnings = createAsyncThunk(
  'earnings/fetchEarnings',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/withdrawals', { params });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch earnings');
    }
  }
);

// Submit a new withdrawal request
export const requestWithdrawal = createAsyncThunk(
  'earnings/requestWithdrawal',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/withdrawals', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit withdrawal request');
    }
  }
);

const earningSlice = createSlice({
  name: 'earnings',
  initialState: {
    cards: {
      totalEarnings: 0,
      totalWithdrawn: 0,
      pendingWithdrawal: 0,
      availableBalance: 0,
    },
    lastBankDetails: null,
    withdrawals: [],
    pagination: { currentPage: 1, totalPages: 1 },
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEarnings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEarnings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cards = action.payload.cards;
        state.lastBankDetails = action.payload.bankDetails;
        state.withdrawals = action.payload.withdrawals;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchEarnings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(requestWithdrawal.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.isSubmitting = false;

        state.withdrawals.unshift(action.payload.withdrawal);
        

        const amount = action.payload.withdrawal.amount;
        state.cards.pendingWithdrawal += amount;
        state.cards.availableBalance -= amount;
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.isSubmitting = false;
      });
  },
});

export default earningSlice.reducer;