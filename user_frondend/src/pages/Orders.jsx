// src/pages/Orders.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders, cancelOrderAction } from '../store/orderSlice';
import { 
  Package, 
  Search, 
  Filter, 
  XCircle, 
  ChevronRight, 
  Loader2,
  ShoppingBag,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

// Helper to format date
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

// Helper for status colors
const getStatusStyles = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
    case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Pending': return <Clock size={14} />;
    case 'Confirmed': return <CheckCircle size={14} />;
    case 'Shipped': return <Truck size={14} />;
    case 'Delivered': return <CheckCircle size={14} />;
    case 'Cancelled': return <XCircle size={14} />;
    default: return <AlertCircle size={14} />;
  }
};

const FILTERS = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
const CANCELLABLE_STATUSES = ['Pending', 'Confirmed']; 

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, isLoading, isCancelling } = useSelector((state) => state.orders);
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setCancellingId(orderId);
      await dispatch(cancelOrderAction(orderId));
      setCancellingId(null);
    }
  };

  const filteredOrders = items.filter(order => {
    const matchesFilter = activeFilter === 'All' || order.orderStatus === activeFilter;
    const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.items.some(item => item.product?.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Get order count by status
  const getOrderCount = (status) => {
    if (status === 'All') return items.length;
    return items.filter(order => order.orderStatus === status).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/30 via-white to-brand-light/20 pb-20">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand-olive/90">
        <div className="absolute top-[-30%] right-[-10%] w-[400px] h-[400px] bg-brand-orange/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-40%] left-[-10%] w-[500px] h-[500px] bg-brand-olive/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-orange/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-4">
                <Package className="h-4 w-4 text-brand-orange" />
                <span className="text-white/90 text-sm font-medium">Your Orders</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
                My <span className="text-brand-orange">Orders</span>
              </h1>
              <p className="text-brand-light/80 mt-2 text-lg">
                {items.length > 0 ? (
                  <>You have <span className="text-brand-orange font-bold">{items.length}</span> total orders</>
                ) : (
                  'No orders placed yet'
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20">
                <span className="text-white/60 text-sm">Total Spent</span>
                <p className="text-white font-bold text-lg">
                  ${items.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* ===== FILTERS AND SEARCH ===== */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-4 md:p-6 border border-white/50 mb-6">
          
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b-2 border-gray-100/80">
            <Filter size={18} className="text-brand-orange mr-1 flex-shrink-0" />
            <span className="text-sm font-semibold text-brand-dark/60 mr-2">Filter:</span>
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`group relative px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'bg-gradient-to-r from-brand-orange to-brand-orange/90 text-white shadow-lg shadow-brand-orange/30 scale-105' 
                    : 'bg-gray-100/50 text-gray-600 hover:bg-gray-200/50 hover:text-brand-dark'
                }`}
              >
                {filter}
                {activeFilter !== filter && getOrderCount(filter) > 0 && (
                  <span className="ml-1.5 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full text-gray-500">
                    {getOrderCount(filter)}
                  </span>
                )}
                {activeFilter === filter && (
                  <span className="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                    {getOrderCount(filter)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 to-brand-olive/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40" size={18} />
              <input
                type="text"
                placeholder="Search by Order ID or Product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-2 border-gray-200/80 rounded-2xl focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all duration-300 text-sm font-medium placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===== ORDERS LIST ===== */}
        {isLoading && items.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-20 text-center border border-white/50">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full border-4 border-brand-orange/20 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-brand-orange border-t-transparent animate-spin"></div>
              </div>
            </div>
            <p className="text-brand-dark/60 font-medium mt-6 animate-pulse">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-16 md:p-20 text-center border border-white/50">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-brand-light/40 to-brand-light/10 mb-6">
              <Package size={48} className="text-brand-dark/30" />
            </div>
            <h3 className="text-2xl font-bold text-brand-dark mb-3">No orders found</h3>
            <p className="text-brand-dark/60 max-w-md mx-auto">
              {searchQuery || activeFilter !== 'All' 
                ? 'Try adjusting your filters or search query.' 
                : 'Start shopping to see your orders here.'}
            </p>
            {(searchQuery || activeFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('All');
                }}
                className="mt-6 inline-flex items-center gap-2 text-brand-orange font-semibold hover:gap-3 transition-all"
              >
                Clear Filters
                <ArrowRight size={16} />
              </button>
            )}
            {!searchQuery && activeFilter === 'All' && (
              <button
                onClick={() => navigate('/products')}
                className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange/90 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-xl hover:shadow-brand-orange/30 transition-all duration-300"
              >
                Start Shopping
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <div 
                key={order._id} 
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 hover:border-brand-orange/20 overflow-hidden animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                
                {/* Order Header */}
                <div className="bg-gradient-to-br from-gray-50/80 to-white p-5 md:p-6 border-b-2 border-gray-100/80">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full md:w-auto text-sm">
                      <div>
                        <p className="text-brand-dark/50 font-medium text-xs uppercase tracking-wider mb-1">Order ID</p>
                        <p className="font-bold text-brand-dark text-base">
                          #{order._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-brand-dark/50 font-medium text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Calendar size={12} />
                          Placed On
                        </p>
                        <p className="font-bold text-brand-dark">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-brand-dark/50 font-medium text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                          <CreditCard size={12} />
                          Total
                        </p>
                        <p className="font-bold text-brand-olive text-lg">${order.totalAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-brand-dark/50 font-medium text-xs uppercase tracking-wider mb-1">Payment</p>
                        <p className="font-bold text-brand-dark text-sm">{order.paymentMethod}</p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-xs font-black uppercase tracking-wider ${getStatusStyles(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-5 md:p-6">
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div 
                        key={item._id} 
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50/50 transition-all duration-300 group"
                      >
                        <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-light/20 to-brand-light/10 border-2 border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                          <img 
                            src={item.product?.images?.[0] || '/placeholder.png'} 
                            alt={item.product?.name || 'Product'} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-bold text-brand-dark truncate group-hover:text-brand-orange transition-colors">
                            {item.product?.name || 'Item Unavailable'}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-brand-dark/50 font-medium">
                              Qty: {item.quantity}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-brand-dark/20"></span>
                            <span className="text-sm font-semibold text-brand-olive">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="font-black text-brand-dark whitespace-nowrap text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer Actions */}
                <div className="p-4 md:p-6 bg-gray-50/50 border-t-2 border-gray-100/80 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-brand-dark/40">
                    <Package size={14} />
                    <span>{order.items.length} items</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {CANCELLABLE_STATUSES.includes(order.orderStatus) && (
                      <button 
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={isCancelling && cancellingId === order._id}
                        className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                      >
                        {isCancelling && cancellingId === order._id ? (
                          <><Loader2 size={16} className="animate-spin" /> Cancelling...</>
                        ) : (
                          <><XCircle size={16} className="group-hover/btn:scale-110 transition-transform" /> Cancel Order</>
                        )}
                      </button>
                    )}
                    
                    <button 
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-brand-orange to-brand-orange/90 text-white hover:shadow-lg hover:shadow-brand-orange/30 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      View Details 
                      <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ===== STATS BOTTOM BAR ===== */}
        {items.length > 0 && (
          <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-3xl p-4 border border-white/50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xs text-brand-dark/40 font-medium">Total Orders</div>
                <div className="text-lg font-black text-brand-dark">{items.length}</div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-xs text-brand-dark/40 font-medium">Total Spent</div>
                <div className="text-lg font-black text-brand-olive">${items.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}</div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-xs text-brand-dark/40 font-medium">Delivered</div>
                <div className="text-lg font-black text-green-600">
                  {items.filter(order => order.orderStatus === 'Delivered').length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-dark/40">
              <Sparkles size={14} className="text-brand-orange" />
              <span>Showing {filteredOrders.length} of {items.length} orders</span>
            </div>
          </div>
        )}

      </section>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}