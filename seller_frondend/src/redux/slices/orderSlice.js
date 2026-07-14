import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/orders/${id}/status`, { orderStatus: status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    cards: {
      totalOrders: 0, pendingOrders: 0, confirmedOrders: 0, 
      shippedOrders: 0, deliveredOrders: 0, cancelledOrders: 0
    },
    pagination: { totalRecords: 0, currentPage: 1, totalPages: 1, limit: 10 },
    isLoading: false,
    isDetailsLoading: false,
    isUpdating: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders List
      .addCase(fetchOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.cards = action.payload.cards;
        state.pagination = {
          totalRecords: action.payload.totalRecords,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          limit: action.payload.limit
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Single Order Details
      .addCase(fetchOrderDetails.pending, (state) => { state.isDetailsLoading = true; })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => { state.isUpdating = true; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (state.currentOrder) {
          state.currentOrder.orderStatus = action.payload.order.orderStatus;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isUpdating = false;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;