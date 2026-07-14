import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  categories: [],
  totalRecords: 0,
  currentPage: 1,
  totalPages: 1,
  listStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  listError: null,

  filters: {
    search: "",
    status: "All", // All | active | inactive
    page: 1,
    limit: 10,
  },

  // the list endpoint returns these alongside the page of results
  summary: { totalCategories: 0, activeCategories: 0, inactiveCategories: 0 },

  selectedCategory: null,
  productCount: null,
  detailStatus: "idle",
  detailError: null,

  actionStatus: "idle", // create / update / status toggle
  actionError: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (params, { rejectWithValue }) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([key, value]) =>
            value !== "" && !(key === "status" && value === "All")
        )
      );
      const response = await api.get("/admin/categories", {
        params: cleanParams,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load categories"
      );
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/categories/${id}`);
      return response.data; // { category, productCount }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load category"
      );
    }
  }
);

// formData: { name, image (File, optional) }
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/categories", formData);
      return response.data.category;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create category"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/categories/${id}`, formData);
      return response.data.category;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update category"
      );
    }
  }
);

export const toggleCategoryStatus = createAsyncThunk(
  "categories/toggleCategoryStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/categories/${id}/status`, {
        isActive,
      });
      return response.data.category;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update category status"
      );
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
      state.productCount = null;
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
      .addCase(fetchCategories.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.categories = action.payload.categories;
        state.totalRecords = action.payload.totalRecords;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.summary = action.payload.cards;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload || "Failed to load categories";
      })

      // detail
      .addCase(fetchCategoryById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedCategory = action.payload.category;
        state.productCount = action.payload.productCount;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload || "Failed to load category";
      })

      // create
      .addCase(createCategory.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.categories.unshift(action.payload);
        state.totalRecords += 1;
        state.summary.totalCategories += 1;
        if (action.payload.isActive) state.summary.activeCategories += 1;
        else state.summary.inactiveCategories += 1;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload || "Failed to create category";
      })

      // update
      .addCase(updateCategory.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const idx = state.categories.findIndex(
          (c) => c._id === action.payload._id
        );
        if (idx !== -1) state.categories[idx] = action.payload;
        if (state.selectedCategory?._id === action.payload._id) {
          state.selectedCategory = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload || "Failed to update category";
      })

      // status toggle
      .addCase(toggleCategoryStatus.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const updated = action.payload;
        const idx = state.categories.findIndex((c) => c._id === updated._id);
        const wasActive = idx !== -1 ? state.categories[idx].isActive : null;
        if (idx !== -1) state.categories[idx] = updated;
        if (state.selectedCategory?._id === updated._id) {
          state.selectedCategory = updated;
        }
        if (wasActive !== null && wasActive !== updated.isActive) {
          if (updated.isActive) {
            state.summary.activeCategories += 1;
            state.summary.inactiveCategories -= 1;
          } else {
            state.summary.activeCategories -= 1;
            state.summary.inactiveCategories += 1;
          }
        }
      })
      .addCase(toggleCategoryStatus.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError =
          action.payload || "Failed to update category status";
      });
  },
});

export const { setFilters, clearSelectedCategory, clearActionError } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;