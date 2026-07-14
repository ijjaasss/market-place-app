import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Star, 
  Wallet, 
  User, 
  // Bell, 
  LogOut,
  Store
} from 'lucide-react';
import { logoutSeller } from '../redux/slices/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Product Management', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Reviews', path: '/reviews', icon: Star },
    { name: 'Earnings', path: '/earnings', icon: Wallet },
    { name: 'Profile', path: '/profile', icon: User },
    // { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const handleLogout = async () => {
    try {
      await dispatch(logoutSeller()).unwrap();
      toast.success('Logged out successfully');
      navigate('/'); 
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col shadow-sm sticky top-0">
      
      {/* Sidebar Header / Logo */}
      <div className="h-20 flex items-center px-8 border-b border-gray-50">
        <div className="flex items-center gap-3 text-[#8E76FF]">
          <div className="p-2 bg-[#E0E0FB] rounded-xl">
            <Store className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl text-gray-900 tracking-tight">Seller Hub</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'} // Ensures exact match for the main dashboard route
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#F3F3FF] text-[#8E76FF]' // Active state styling
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900' // Inactive state styling
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Logout Button Section */}
      <div className="p-4 border-t border-gray-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;