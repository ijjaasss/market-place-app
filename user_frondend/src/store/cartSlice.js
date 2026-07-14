// src/store/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchCartCount = createAsyncThunk('cart/fetchCount', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cart/count');
    return response.data.data; // { itemsCount, totalQuantity }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart count');
  }
});
// Fetch the entire cart
export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cart');
    return response.data.data; // { items: [], subtotal: 0, cartId: ... }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

// Update item quantity
export const updateCartItem = createAsyncThunk('cart/updateItem', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/cart/${productId}`, { quantity });
    return response.data.data; // Returns raw populated cart
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
  }
});

// Remove single item
export const removeCartItem = createAsyncThunk('cart/removeItem', async (productId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/cart/${productId}`);
    return response.data.data; 
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
  }
});

// Clear entire cart
export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart');
    return []; // Return empty array on success
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
  }
});

// Helper function to recalculate totals when raw cart data is returned
const recalculateCart = (items) => {
  let subtotal = 0;
  const processedItems = items.map(item => {
    const isAvailable = item.product && item.product.status === "Approved" && !item.product.isDeleted;
    const lineTotal = isAvailable && item.product.stock > 0 ? item.product.price * item.quantity : 0;
    subtotal += lineTotal;
    
    return {
      product: item.product,
      quantity: item.quantity,
      isAvailable: Boolean(isAvailable && item.product.stock > 0),
      lineTotal
    };
  });
  return { items: processedItems, subtotal };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    subtotal: 0,
    totalQuantity: 0,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartCount.fulfilled, (state, action) => {
        state.totalQuantity = action.payload.totalQuantity || 0;
      })
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
       .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.subtotal = 0;
      })
      // Update Item & Remove Item (both return raw cart, so we recalculate)
      .addMatcher(
        (action) => action.type === updateCartItem.fulfilled.type || action.type === removeCartItem.fulfilled.type,
        (state, action) => {
          const recalculated = recalculateCart(action.payload.items);
          state.items = recalculated.items;
          state.subtotal = recalculated.subtotal;
        }
      )
      
     

  },
});

export default cartSlice.reducer;