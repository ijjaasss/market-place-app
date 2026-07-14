import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  products: [],
  totalRecords: 0,
  currentPage: 1,
  totalPages: 1,
  listStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  listError: null,

  filters: {
    search: "",
    status: "All", // All | Pending | Approved | Rejected
    category: "All", // "All" or a category _id
    sort: "newest", // newest | oldest | name-asc | price-asc | price-desc
    page: 1,
    limit: 10,
  },

  // returned alongside the list ("cards")
  summary: {
    totalProducts: 0,
    pendingProducts: 0,
    approvedProducts: 0,
    rejectedProducts: 0,
  },

  selectedProduct: null,
  detailStatus: "idle",
  detailError: null,

  actionStatus: "idle", // approve / reject / delete
  actionError: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([key, value]) =>
            value !== "" &&
            !((key === "status" || key === "category") && value === "All")
        )
      );
      const response = await api.get("/admin/product", {
        params: cleanParams,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/product/${id}`);
      return response.data.product;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load product"
      );
    }
  }
);

// status: "Approved" | "Rejected". rejectReason only used for Rejected.
export const updateProductStatus = createAsyncThunk(
  "products/updateProductStatus",
  async ({ id, status, rejectReason }, { rejectWithValue }) => {
    try {
      const body =
        status === "Rejected" ? { status, rejectReason } : { status };
      const response = await api.patch(`/admin/product/${id}/status`, body);
      return response.data.product;
    } catch (err) {
    
      
      return rejectWithValue(
        err.response?.data?.message || "Failed to update product status"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.patch(`/admin/product/${id}/delete`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const summaryDeltaForStatusChange = (summary, previousStatus, nextStatus) => {
  if (previousStatus === nextStatus) return;
  const key = (s) =>
    s === "Pending"
      ? "pendingProducts"
      : s === "Approved"
      ? "approvedProducts"
      : "rejectedProducts";
  if (previousStatus) summary[key(previousStatus)] -= 1;
  summary[key(nextStatus)] += 1;
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
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
      .addCase(fetchProducts.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.products = action.payload.products;
        state.totalRecords = action.payload.totalRecords;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.summary = action.payload.cards;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload || "Failed to load products";
      })

      // detail
      .addCase(fetchProductById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload || "Failed to load product";
      })

      // status update
      .addCase(updateProductStatus.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const updated = action.payload;
        const idx = state.products.findIndex((p) => p._id === updated._id);
        const previousStatus = idx !== -1 ? state.products[idx].status : null;

        if (idx !== -1) {
          state.products[idx] = { ...state.products[idx], ...updated };
        }
        if (state.selectedProduct?._id === updated._id) {
          state.selectedProduct = { ...state.selectedProduct, ...updated };
        }
        summaryDeltaForStatusChange(
          state.summary,
          previousStatus,
          updated.status
        );
      })
      .addCase(updateProductStatus.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload || "Failed to update product";
      })

      // delete
      .addCase(deleteProduct.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const id = action.payload;
        const idx = state.products.findIndex((p) => p._id === id);
        if (idx !== -1) {
          const removed = state.products[idx];
          state.products.splice(idx, 1);
          state.totalRecords = Math.max(0, state.totalRecords - 1);
          state.summary.totalProducts = Math.max(
            0,
            state.summary.totalProducts - 1
          );
          if (removed.status === "Pending") state.summary.pendingProducts -= 1;
          if (removed.status === "Approved")
            state.summary.approvedProducts -= 1;
          if (removed.status === "Rejected")
            state.summary.rejectedProducts -= 1;
        }
        if (state.selectedProduct?._id === id) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload || "Failed to delete product";
      });
  },
});

export const { setFilters, clearSelectedProduct, clearActionError } =
  productsSlice.actions;
export default productsSlice.reducer;