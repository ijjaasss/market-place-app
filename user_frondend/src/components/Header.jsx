// src/components/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { fetchCartCount } from '../store/cartSlice';
import { fetchWishlistCount } from '../store/wishlistSlice';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User as UserIcon, 
  LogOut, 
  Package, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  // Pull counts directly from Redux state
  const cartCount = useSelector((state) => state.cart.totalQuantity);
  const wishlistCount = useSelector((state) => state.wishlist.count);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch initial counts when user logs in or page loads
  useEffect(() => {
    if (user) {
      dispatch(fetchCartCount());
      dispatch(fetchWishlistCount());
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsProfileDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Left - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-black text-brand-orange tracking-tight">
              Market Place<span className="text-brand-olive">.</span>
            </Link>
          </div>

          {/* Center - Navigation (Desktop) */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-brand-dark hover:text-brand-orange font-medium transition-colors">Home</Link>
            <Link to="/categories" className="text-brand-dark hover:text-brand-orange font-medium transition-colors">Categories</Link>
            <Link to="/products" className="text-brand-dark hover:text-brand-orange font-medium transition-colors">Products</Link>
          </nav>

          {/* Right - Search, Icons, Auth */}
          <div className="hidden md:flex items-center space-x-6">
            
            <Link to="/wishlist" className="text-brand-dark hover:text-brand-orange transition-colors relative">
              <Heart className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="text-brand-dark hover:text-brand-orange transition-colors relative">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 text-brand-dark hover:text-brand-orange transition-colors focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-brand-olive text-white flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100">
                    <Link 
                      to="/orders" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand-light/20 hover:text-brand-orange"
                    >
                      <Package className="mr-3 h-4 w-4" /> Orders
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-brand-dark font-medium hover:text-brand-orange transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-brand-orange text-white px-5 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors shadow-md shadow-brand-orange/20">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-brand-dark hover:text-brand-orange focus:outline-none relative"
            >
              {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              {!isMobileMenuOpen && (cartCount > 0 || wishlistCount > 0) && (
                <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-brand-orange rounded-full border-2 border-white"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg absolute w-full">
          
          <div className="flex flex-col space-y-3 pt-2">
            <Link to="/" className="text-brand-dark font-medium px-2 py-1">Home</Link>
            <Link to="/categories" className="text-brand-dark font-medium px-2 py-1">Categories</Link>
            <Link to="/products" className="text-brand-dark font-medium px-2 py-1">Products</Link>
            
            <Link to="/wishlist" className="text-brand-dark font-medium px-2 py-1 flex items-center justify-between">
              <div className="flex items-center">
                <Heart className="mr-3 h-5 w-5" /> Wishlist
              </div>
              {wishlistCount > 0 && (
                <span className="bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="text-brand-dark font-medium px-2 py-1 flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart className="mr-3 h-5 w-5" /> Cart
              </div>
              {cartCount > 0 && (
                <span className="bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-4">
            {user ? (
              <div className="space-y-3">
                <Link to="/profile" className="text-brand-dark font-medium px-2 py-1 flex items-center"><UserIcon className="mr-3 h-5 w-5" /> Profile</Link>
                <Link to="/orders" className="text-brand-dark font-medium px-2 py-1 flex items-center"><Package className="mr-3 h-5 w-5" /> Orders</Link>
                <button onClick={handleLogout} className="text-red-600 font-medium px-2 py-1 flex items-center w-full text-left"><LogOut className="mr-3 h-5 w-5" /> Logout</button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link to="/login" className="w-full text-center bg-brand-light/40 text-brand-dark py-3 rounded-xl font-medium">Login</Link>
                <Link to="/register" className="w-full text-center bg-brand-orange text-white py-3 rounded-xl font-medium">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}