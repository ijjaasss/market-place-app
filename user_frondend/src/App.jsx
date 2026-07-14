// src/App.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { checkAuth } from './store/authSlice';


import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';

// Placeholder Pages (You will build these later based on your structure)

const Profile = () => <div className="p-8 text-2xl font-bold">Protected Profile</div>;
const NotFound = () => <div className="p-8 text-2xl font-bold">404 - Not Found</div>;

export default function App() {
  const dispatch = useDispatch();
  const { isCheckingAuth, user } = useSelector((state) => state.auth);

  // On initial load, verify if the user has a valid httpOnly cookie
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Prevent UI flickering by showing a loader until the /me check is complete
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <Loader2 className="h-10 w-10 text-brand-orange animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" />
      <Header />


      <Routes>
      
        <Route path="/" element={<Home />} />
        

        <Route 
          path="/login" 
          element={user ? <Navigate to="/" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" replace /> : <Register />} 
        />
        <Route path="/products" element={<Products />} />
         <Route path="/categories" element={<Categories />} />
         <Route path="/products/:id" element={<ProductDetails />} />



        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path='/cart' element={<Cart />}/>
          <Route path='/wishlist' element={<Wishlist />}/>
          <Route path='/checkout' element={<Checkout />}/>
          <Route path='/orders' element={<Orders />} />
          <Route path='/orders/:id' element={<OrderDetails />} />
        </Route>

    
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />

    </BrowserRouter>
  );
}