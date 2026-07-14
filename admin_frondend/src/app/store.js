import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice"
import sellerReducer from "../features/sellers/sellersSlice"
import categoriesReducer from "../features/categories/categoriesSlice"
import productsReducer from "../features/products/productsSlice"
import usersReducer from "../features/users/usersSlice"
import ordersSlice from "../features/orders/ordersSlice"
import withdrawalReducer from "../features/withdrawals/withdrawalsSlice"
import reviewReducer from "../features/reviews/reviewsSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    sellers:sellerReducer,
     categories:categoriesReducer,
     products:productsReducer,
     users:usersReducer,
     orders:ordersSlice,
     withdrawals:withdrawalReducer,
     reviews:reviewReducer,
  },
});