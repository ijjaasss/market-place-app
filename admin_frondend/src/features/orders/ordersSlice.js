import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/orders", { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/orders/${id}`);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch order");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/orders/${id}/status`, { orderStatus });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  "orders/updatePaymentStatus",
  async ({ id, paymentStatus }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/orders/${id}/payment-status`, { paymentStatus });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update payment");
    }
  }
);

const initialState = {
  orders: [],
  selectedOrder: null,
  summary: {
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  },
  totalPages: 1,
  filters: {
    page: 1,
    limit: 10,
    search: "",
    status: "",
    payment: "",
    sort: "newest",
  },
  listStatus: "idle",
  detailStatus: "idle",
  actionStatus: "idle",
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.orders = action.payload.orders;
        state.summary = action.payload.cards;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })
      // Fetch Single Order
      .addCase(fetchOrderById.pending, (state) => {
        state.detailStatus = "loading";
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedOrder = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        if (state.selectedOrder && state.selectedOrder._id === action.payload.order._id) {
          state.selectedOrder.orderStatus = action.payload.order.orderStatus;
        }
        const index = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index].orderStatus = action.payload.order.orderStatus;
        }
      })
      // Update Payment Status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        if (state.selectedOrder && state.selectedOrder._id === action.payload.order._id) {
          state.selectedOrder.paymentStatus = action.payload.order.paymentStatus;
        }
        const index = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index].paymentStatus = action.payload.order.paymentStatus;
        }
      });
  },
});

export const { setFilters, clearSelectedOrder } = ordersSlice.actions;
export default ordersSlice.reducer;