import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import categoryReducer from "../store/categorySlice"
import productReducer from "../store/productSlice"
import cartReducer from "../store/cartSlice"
import wishlistReducer from "../store/wishlistSlice"
import orderReducer from "../store/orderSlice"
import reviewsReducer from "../store/reviewSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    products: productReducer,
    cart: cartReducer,
    wishlist:wishlistReducer,
    orders:orderReducer,
    reviews:reviewsReducer,
  },
});