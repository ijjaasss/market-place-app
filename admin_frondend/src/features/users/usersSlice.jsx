import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  users: [],
  totalRecords: 0,
  currentPage: 1,
  totalPages: 1,
  listStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  listError: null,

  filters: {
    search: "",
    status: "All", // All | active | blocked
    sort: "newest", // newest | oldest | name-asc
    page: 1,
    limit: 10,
  },

  // returned alongside the list ("cards")
  summary: {
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    newUsers: 0,
  },

  // user detail page: { name, email, phone, profileImage, joinedDate, status }
  selectedUser: null,
  selectedUserId: null,
  statistics: null, // { totalOrders, completedOrders, cancelledOrders, totalSpent }
  recentOrders: [],
  detailStatus: "idle",
  detailError: null,

  actionStatus: "idle", // block / unblock
  actionError: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params, { rejectWithValue }) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([key, value]) => value !== "" && !(key === "status" && value === "All")
        )
      );
      const response = await api.get("/admin/user", { params: cleanParams });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load users"
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/user/${id}`);
      return response.data; // { user, statistics, recentOrders }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load user"
      );
    }
  }
);

// isBlocked: true to block, false to unblock
export const toggleUserStatus = createAsyncThunk(
  "users/toggleUserStatus",
  async ({ id, isBlocked }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/user/${id}/status`, {
        isBlocked,
      });
      return response.data.user; // raw user doc: has _id, isblocked, etc.
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update user status"
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.selectedUserId = null;
      state.statistics = null;
      state.recentOrders = [];
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
      .addCase(fetchUsers.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.users = action.payload.users;
        state.totalRecords = action.payload.totalRecords;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.summary = action.payload.cards;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload || "Failed to load users";
      })

      // detail
      .addCase(fetchUserById.pending, (state, action) => {
        state.detailStatus = "loading";
        state.detailError = null;
        state.selectedUserId = action.meta.arg;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedUser = action.payload.user;
        state.statistics = action.payload.statistics;
        state.recentOrders = action.payload.recentOrders;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload || "Failed to load user";
      })

      // block / unblock
      .addCase(toggleUserStatus.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const updated = action.payload;

        const idx = state.users.findIndex((u) => u._id === updated._id);
        if (idx !== -1) {
          const wasBlocked = state.users[idx].isblocked;
          state.users[idx] = updated;
          if (wasBlocked !== updated.isblocked) {
            if (updated.isblocked) {
              state.summary.activeUsers -= 1;
              state.summary.blockedUsers += 1;
            } else {
              state.summary.activeUsers += 1;
              state.summary.blockedUsers -= 1;
            }
          }
        }

        // the detail page's user object has a different shape ({status: "Active"|"Blocked"})
        if (state.selectedUserId === updated._id && state.selectedUser) {
          state.selectedUser.status = updated.isblocked ? "Blocked" : "Active";
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload || "Failed to update user status";
      });
  },
});

export const { setFilters, clearSelectedUser, clearActionError } =
  usersSlice.actions;
export default usersSlice.reducer;