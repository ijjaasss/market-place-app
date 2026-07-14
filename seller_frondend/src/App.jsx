import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { checkAuth } from './redux/slices/authSlice';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import Earnings from './pages/Earnings';
import SellerProfile from './pages/SellerProfile';
import Reviews from './pages/Reviews';

// A simple protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  
  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/" />;
};

const App = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check for cookie session on initial load
    dispatch(checkAuth());
  }, [dispatch]);

  // Don't render routes until initial auth check is complete to prevent layout shift
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center text-gray-500">Initializing App...</div>;
  }

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/register" element={<Register />} />
        
       <Route element={
        <ProtectedRoute>
              <DashboardLayout />
          </ProtectedRoute>
       }>
        <Route 
          path="/dashboard" 
          element={ <Dashboard /> } />
          <Route path='/products' element={<Products />}/>
          <Route path="/orders" element={<Orders />} />
           <Route path="/orders/:id" element={<OrderDetails />} />
           <Route path="/customers" element={<Customers />} />
           <Route path="/customers/:id" element={<CustomerDetails  />} />
           <Route path="/earnings" element={<Earnings />} />
           <Route path='/profile' element={<SellerProfile />} />
           <Route path='/reviews' element={<Reviews />} />
        </Route>
        
      </Routes>
    </Router>
  );
};

export default App;