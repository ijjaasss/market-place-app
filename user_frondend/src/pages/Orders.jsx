// src/pages/Orders.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders, cancelOrderAction } from '../store/orderSlice';
import { Package, Search, Filter, XCircle, ChevronRight, Loader2 } from 'lucide-react';

// Helper to format date
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

// Helper for status colors
const getStatusStyles = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-700';
    case 'Confirmed': return 'bg-blue-100 text-blue-700';
    case 'Shipped': return 'bg-purple-100 text-purple-700';
    case 'Delivered': return 'bg-green-100 text-green-700';
    case 'Cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const FILTERS = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
// Usually only Pending or Confirmed orders can be cancelled by the user
const CANCELLABLE_STATUSES = ['Pending', 'Confirmed']; 

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, isLoading, isCancelling } = useSelector((state) => state.orders);
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    // Fetch first page of orders on mount
    dispatch(fetchOrders({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setCancellingId(orderId);
      await dispatch(cancelOrderAction(orderId));
      setCancellingId(null);
    }
  };

  // Client-side filtering
  const filteredOrders = items.filter(order => {
    const matchesFilter = activeFilter === 'All' || order.orderStatus === activeFilter;
    const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.items.some(item => item.product?.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-brand-orange/10 p-3 rounded-xl text-brand-orange">
            <Package size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-brand-dark">My Orders</h1>
            <p className="text-brand-dark/60 font-medium mt-1">View and manage your recent purchases</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between gap-4">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center overflow-x-auto custom-scrollbar pb-2 md:pb-0 gap-2">
            <Filter size={18} className="text-gray-400 mr-2 flex-shrink-0" />
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                  activeFilter === filter 
                    ? 'bg-brand-dark text-white' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72 flex-shrink-0">
            <input
              type="text"
              placeholder="Search Order ID or Product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm font-medium"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Orders List */}
        {isLoading && items.length === 0 ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-orange" size={40} /></div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-16 text-center border border-gray-100">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-brand-dark">No orders found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* Order Header */}
                <div className="bg-gray-50/80 p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full sm:w-auto text-sm">
                    <div>
                      <p className="text-gray-500 font-medium mb-1">Order ID</p>
                      <p className="font-bold text-brand-dark">#{order._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-1">Placed On</p>
                      <p className="font-bold text-brand-dark">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-1">Total</p>
                      <p className="font-bold text-brand-olive">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-1">Payment</p>
                      <p className="font-bold text-brand-dark">{order.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${getStatusStyles(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                          <img 
                            src={item.product?.images?.[0] || '/placeholder.png'} 
                            alt={item.product?.name || 'Product'} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-bold text-brand-dark truncate">{item.product?.name || 'Item Unavailable'}</h4>
                          <p className="text-sm text-gray-500 font-medium mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-black text-brand-dark whitespace-nowrap">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer Actions */}
                <div className="p-4 sm:p-6 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-end items-center gap-3">
                  {CANCELLABLE_STATUSES.includes(order.orderStatus) && (
                    <button 
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={isCancelling && cancellingId === order._id}
                      className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isCancelling && cancellingId === order._id ? (
                        <><Loader2 size={16} className="animate-spin" /> Cancelling...</>
                      ) : (
                        <><XCircle size={16} /> Cancel Order</>
                      )}
                    </button>
                  )}
                  
                  <button 
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold bg-brand-dark text-white hover:bg-brand-dark/90 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    View Details <ChevronRight size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}