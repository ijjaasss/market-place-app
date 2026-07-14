import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/categories');
      return response.data.categories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    categories: [],
    cards: { totalProducts: 0, approvedProducts: 0, pendingProducts: 0, rejectedProducts: 0 },
    pagination: { totalRecords: 0, currentPage: 1, totalPages: 1, limit: 10 },
    isLoading: false,
    isActionLoading: false, // For Add/Edit/Delete actions
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.cards = action.payload.cards;
        state.pagination = {
          totalRecords: action.payload.totalRecords,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          limit: action.payload.limit
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Add/Update/Delete states
      .addCase(addProduct.pending, (state) => { state.isActionLoading = true; })
      .addCase(addProduct.fulfilled, (state) => { state.isActionLoading = false; })
      .addCase(addProduct.rejected, (state) => { state.isActionLoading = false; })
      .addCase(updateProduct.pending, (state) => { state.isActionLoading = true; })
      .addCase(updateProduct.fulfilled, (state) => { state.isActionLoading = false; })
      .addCase(updateProduct.rejected, (state) => { state.isActionLoading = false; })
      .addCase(deleteProduct.pending, (state) => { state.isActionLoading = true; })
      .addCase(deleteProduct.fulfilled, (state) => { state.isActionLoading = false; })
      .addCase(deleteProduct.rejected, (state) => { state.isActionLoading = false; });
  },
});

export default productSlice.reducer;