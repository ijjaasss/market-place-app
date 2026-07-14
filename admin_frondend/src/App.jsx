import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { fetchAdminProfile } from "./features/auth/authSlice";
import AdminLayout from "./components/sidbar/AdminLayout";
import SellersPage from "./pages/SellersPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/Userspage";
import UserDetailPage from "./pages/UserDetailPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import Withdrawals from "./pages/Withdrawals";
import WithdrawalDetails from "./pages/WithdrawalDetails";
import ReviewsPage from "./pages/ReviewsPage";
import ReviewDetailPage from "./pages/ReviewDetailPage";

function App() {
  const dispatch = useDispatch();
  const authChecked = useSelector((state) => state.auth.authChecked);

  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0F1320] flex items-center justify-center">
        <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
      </div>
    );
  }

  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route element={
        <ProtectedRoute>
        <AdminLayout />
        </ProtectedRoute>
        }>

      <Route
        path="/dashboard"
        element={   <Dashboard />}
      />
       <Route path="/sellers" element={<SellersPage />} />
       <Route path="/categories" element={<CategoriesPage  />} />
       <Route path="/products"  element={<ProductsPage />}/>
       <Route path="/users" element={<UsersPage />} />
       <Route path="/users/:id" element={<UserDetailPage />} />
       <Route path="/orders" element={<OrdersPage />} />
       <Route path="/orders/:id" element={<OrderDetailPage />} />
       <Route path="/withdrawals" element={<Withdrawals />} />
       <Route path="/withdrawals/:id" element={<WithdrawalDetails />} />
       <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/reviews/:id" element={<ReviewDetailPage />} />
       </Route>
   
    </Routes>
  );
}

export default App;