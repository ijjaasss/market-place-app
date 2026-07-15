// src/store/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { fetchCartCount } from "./cartSlice";
import { fetchWishlistCount } from './wishlistSlice';
import { toast } from 'react-toastify';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {

      const response = await api.get('/products', { params });
      return response.data; 
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch products';
      return rejectWithValue(message);
    }
  }
);

// Async Thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}`);
      // The API returns { data: { product: {...}, relatedProducts: [...] } }
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch product details';
      return rejectWithValue(message);
    }
  }
);
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async ({ categoryId, params }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/categories/${categoryId}/products`, { params });
      return response.data; // Returns: { products, totalRecords, currentPage, totalPages, limit }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category products');
    }
  }
);
export const addToCart = createAsyncThunk(
  'products/addToCart',
  async (productId, { rejectWithValue,dispatch }) => {
    try {
      const response = await api.post('/cart', { productId, quantity: 1 });
        dispatch(fetchCartCount());
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'products/addToWishlist',
  async (productId, { rejectWithValue,dispatch }) => {
    try {
      const response = await api.post('/wishlist', { productId });
      dispatch(fetchWishlistCount())
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);
const productSlice = createSlice({
  name: 'products',
  initialState: {
    // List state
    items: [],
    pagination: {
      total: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 12,
      count: 0,
    },
    isListLoading: false,
    listError: null,

    // Single Product state
    currentProduct: null,
    relatedProducts: [],
    isDetailsLoading: false,
    detailsError: null,
  },
  reducers: {
    // Useful for clearing out old product details when navigating to a new product page
    clearProductDetails: (state) => {
      state.currentProduct = null;
      state.relatedProducts = [];
      state.detailsError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Products List ---
      .addCase(fetchProducts.pending, (state) => {
        state.isListLoading = true;
        state.listError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isListLoading = false;
        state.items = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
          count: action.payload.count,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isListLoading = false;
        state.listError = action.payload;
      })

      // --- Fetch Product Details ---
      .addCase(fetchProductDetails.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.currentProduct = action.payload.product;
        state.relatedProducts = action.payload.relatedProducts;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError = action.payload;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isListLoading = true;
        state.listError = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isListLoading = false;
        state.items = action.payload.products; // Mapping 'products' array
        state.pagination = {
          total: action.payload.totalRecords, // Mapping 'totalRecords'
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isListLoading = false;
        state.listError = action.payload;
      })
      .addCase(addToWishlist.fulfilled,(state,action)=>{
         const productId = action.meta.arg;

  // Update product list
  state.items = state.items.map((product) =>
    product._id === productId
      ? {
          ...product,
          isWishlisted: !product.isWishlisted,
        }
      : product
  );

  // Update current product
  if (
    state.currentProduct &&
    state.currentProduct._id === productId
  ) {
    state.currentProduct.isWishlisted =
      !state.currentProduct.isWishlisted;
  }
      })
  },
});

export const { clearProductDetails } = productSlice.actions;
export default productSlice.reducer;