// src/store/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { fetchCart } from './cartSlice'; 

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/checkout', orderData);

      dispatch(fetchCart()); 
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to place order');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data; // { count, total, totalPages, currentPage, data }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);
export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
);
export const cancelOrderAction = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/orders/${orderId}/cancel`);
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    isProcessing: false,
    currentOrder: null,
    items: [],
    pagination: {
      total: 0,
      totalPages: 0,
      currentPage: 1,
    },
    isLoading: false,
    error: null,
    isCancelling: false,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Cancel Order
      .addCase(cancelOrderAction.pending, (state) => {
        state.isCancelling = true;
      })
      .addCase(cancelOrderAction.fulfilled, (state, action) => {
        state.isCancelling = false;
        // Update the specific order's status in the list
        const index = state.items.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(cancelOrderAction.rejected, (state, action) => {
        state.isCancelling = false;
        state.error = action.payload;
      })
.addCase(fetchOrderById.pending, (state) => {
  state.isLoading = true;
})
.addCase(fetchOrderById.fulfilled, (state, action) => {
  state.isLoading = false;
  state.currentOrder = action.payload;
})
.addCase(fetchOrderById.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
})
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;