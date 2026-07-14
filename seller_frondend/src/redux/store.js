import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from "./slices/dashboardSlice"
import productReducer from "./slices/productSlice"
import orderReducer from "./slices/orderSlice"
import customerReducer from "./slices/customerSlice"
import earningReducer from "./slices/earningSlice"
import reviewReducer from "./slices/reviewSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard:dashboardReducer,
    products:productReducer,
    orders: orderReducer,
    customers: customerReducer,
    earnings: earningReducer,
    reviews:reviewReducer,
  },
});