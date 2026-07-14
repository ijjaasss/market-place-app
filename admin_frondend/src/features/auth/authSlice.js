import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  admin: null,
  isAuthenticated: false,
  status: "idle", 
  authChecked: false,
  error: null,
};


export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/login", credentials);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to log in. Check your credentials and try again.";
      return rejectWithValue(message);
    }
  }
);


export const fetchAdminProfile = createAsyncThunk(
  "auth/fetchAdminProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/me");
      console.log("data",response.data);
      
      return response.data;
    } catch (err) {
        console.log("err",err);
        
      return rejectWithValue(
        err.response?.data?.message || "Not authenticated"
      );
    }
  }
);

// Logs out server-side (clears the cookie) and resets local state.
export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/admin/logout");
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Logout failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.admin = action.payload.data;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.error = action.payload || "Login failed";
      })


      .addCase(fetchAdminProfile.pending, (state) => {
        state.status = "loading";
        state.isAuthenticated = false;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
       
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.authChecked = true;
      })
      .addCase(fetchAdminProfile.rejected, (state) => {
        state.status = "idle";
        state.isAuthenticated = false;
        state.admin = null;
        state.authChecked = true;
      })


      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.isAuthenticated = false;
        state.status = "idle";
      })
      .addCase(logoutAdmin.rejected, (state) => {

        state.admin = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;