import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios'; // Adjust this import based on your axios instance

// Fetch all customers for the seller
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/customers', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

// Fetch specific customer details
export const fetchCustomerDetails = createAsyncThunk(
  'customers/fetchCustomerDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer details');
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    currentCustomer: null,
    cards: {
      totalCustomers: 0,
      activeCustomers: 0,
      newCustomers: 0,
      totalOrders: 0,
    },
    pagination: { totalRecords: 0, currentPage: 1, totalPages: 1, limit: 10 },
    isLoading: false,
    isDetailsLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload.customers;
        state.cards = action.payload.cards;
        state.pagination = {
          totalRecords: action.payload.totalRecords,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Customer Details
      .addCase(fetchCustomerDetails.pending, (state) => {
        state.isDetailsLoading = true;
      })
      .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        // Storing the entire payload (customer, statistics, orders, products, shippingAddresses)
        state.currentCustomer = action.payload; 
      })
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentCustomer } = customerSlice.actions;
export default customerSlice.reducer;