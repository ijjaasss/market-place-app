// src/pages/OrderDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../store/orderSlice';
import { createReview } from '../store/reviewSlice';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard, 
  Loader2, 
  Store, 
  Star, 
  X,
  ShoppingBag,
  Calendar,
  Clock,
  CheckCircle,
  ShieldCheck,
  Receipt,
  User,
  Phone,
  Home,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-toastify';

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

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
    case 'Pending': return <Clock size={16} />;
    case 'Confirmed': return <CheckCircle size={16} />;
    case 'Shipped': return <Truck size={16} />;
    case 'Delivered': return <CheckCircle size={16} />;
    case 'Cancelled': return <X size={16} />;
    default: return <Clock size={16} />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'text-yellow-500';
    case 'Confirmed': return 'text-blue-500';
    case 'Shipped': return 'text-purple-500';
    case 'Delivered': return 'text-green-500';
    case 'Cancelled': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

export default function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentOrder, isLoading, error } = useSelector((state) => state.orders);
  const { isSubmitting } = useSelector((state) => state.reviews);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ productId: null, rating: 5, reviewText: '' });

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  const openReviewModal = (productId) => {
    setReviewData({ productId, rating: 5, reviewText: '' });
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(createReview({
      product: reviewData.productId,
      rating: reviewData.rating,
      review: reviewData.reviewText
    }));

    if (createReview.fulfilled.match(resultAction)) {
      toast.success("Review submitted successfully!");
      setIsReviewModalOpen(false);
    } else {
      toast.error(resultAction.payload || "Failed to submit review");
    }
  };

  if (isLoading || !currentOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-light/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full border-4 border-brand-orange/20 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-brand-orange border-t-transparent animate-spin"></div>
            </div>
          </div>
          <p className="text-brand-dark/60 font-medium mt-6 animate-pulse">Loading order details...</p>
        </div>
      </div>
    );
  }

  const { shippingAddress, items, totalAmount, paymentMethod, orderStatus, createdAt } = currentOrder;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/30 via-white to-brand-light/20 pb-20">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand-olive/90">
        <div className="absolute top-[-30%] right-[-10%] w-[400px] h-[400px] bg-brand-orange/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-40%] left-[-10%] w-[500px] h-[500px] bg-brand-olive/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <button 
                onClick={() => navigate('/orders')} 
                className="inline-flex items-center gap-2 text-brand-light/70 hover:text-white transition-colors mb-4 group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Orders</span>
              </button>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-4">
                <Receipt className="h-4 w-4 text-brand-orange" />
                <span className="text-white/90 text-sm font-medium">Order Details</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
                Order <span className="text-brand-orange">#{currentOrder._id.slice(-6).toUpperCase()}</span>
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2 text-brand-light/70">
                  <Calendar size={16} />
                  <span className="font-medium">{formatDate(createdAt)}</span>
                </div>
                <span className="text-brand-light/30">|</span>
                <div className="flex items-center gap-2 text-brand-light/70">
                  <CreditCard size={16} />
                  <span className="font-medium">{paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 text-sm font-black uppercase tracking-wider ${getStatusStyles(orderStatus)} bg-white/10 backdrop-blur-sm`}>
              {getStatusIcon(orderStatus)}
              {orderStatus}
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Products List */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="p-6 md:p-8 border-b-2 border-gray-100/80 flex items-center gap-3">
                <div className="bg-gradient-to-br from-brand-orange/20 to-brand-orange/10 p-2.5 rounded-2xl">
                  <ShoppingBag className="text-brand-orange" size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-brand-dark">Items in Order</h2>
                  <p className="text-sm text-brand-dark/60">{items.length} products</p>
                </div>
              </div>
              
              <div className="p-6 md:p-8 space-y-6">
                {items.map((item, index) => (
                  <div 
                    key={item._id} 
                    className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-gray-100/80 last:border-0 last:pb-0 animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Product Image */}
                    <div className="w-full sm:w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-light/20 to-brand-light/10 border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                      <img 
                        src={item.product?.images?.[0] || '/placeholder.png'} 
                        alt={item.product?.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <h3 
                            onClick={() => navigate(`/products/${item.product._id}`)}
                            className="font-bold text-lg text-brand-dark hover:text-brand-orange transition-colors cursor-pointer"
                          >
                            {item.product?.name || 'Product Unavailable'}
                          </h3>
                          {item.seller && (
                            <p className="text-sm text-brand-dark/50 font-medium flex items-center gap-1 mt-1">
                              <Store size={14} className="text-brand-olive" /> 
                              Sold by: {item.seller.shopname}
                            </p>
                          )}
                        </div>
                        
                        {/* Write Review Button */}
                        {orderStatus === 'Delivered' && item.product && (
                          <button 
                            onClick={() => openReviewModal(item.product._id)}
                            className="group flex items-center gap-2 text-sm font-bold text-brand-orange hover:text-white hover:bg-brand-orange px-4 py-2 rounded-xl transition-all duration-300 border-2 border-brand-orange hover:shadow-lg hover:shadow-brand-orange/30"
                          >
                            <Star size={16} className="fill-yellow-400 text-yellow-400 group-hover:text-white group-hover:fill-white" />
                            Write Review
                          </button>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-end mt-4 sm:mt-0">
                        <div className="flex items-center gap-3">
                          <span className="text-brand-dark/70 font-medium">Qty:</span>
                          <span className="font-bold text-brand-dark bg-gray-100/50 px-3 py-1 rounded-full">{item.quantity}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-brand-dark/50 line-through mr-2">
                            ${(item.price * item.quantity * 1.2).toFixed(2)}
                          </span>
                          <span className="text-xl font-black text-brand-olive">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="p-6 md:p-8 border-b-2 border-gray-100/80 flex items-center gap-3">
                <div className="bg-gradient-to-br from-brand-olive/20 to-brand-olive/10 p-2.5 rounded-2xl">
                  <MapPin className="text-brand-olive" size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-brand-dark">Delivery Address</h2>
                  <p className="text-sm text-brand-dark/60">Where your order was delivered</p>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="bg-gradient-to-br from-gray-50/80 to-white rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-brand-orange/10 p-3 rounded-2xl">
                      <User className="text-brand-orange" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-brand-dark text-lg mb-1">{shippingAddress.fullName}</p>
                      <div className="space-y-1.5 text-brand-dark/70">
                        <p className="flex items-start gap-2">
                          <Home size={16} className="text-brand-dark/40 mt-0.5 flex-shrink-0" />
                          <span>{shippingAddress.address}</span>
                        </p>
                        <p className="pl-6">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
                        <p className="pl-6">{shippingAddress.country}</p>
                        <p className="flex items-center gap-2 pt-2 text-brand-dark">
                          <Phone size={16} className="text-brand-olive" />
                          <span className="font-semibold">{shippingAddress.phone}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                        <Truck size={14} />
                        Delivered
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Payment Summary */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 md:p-8 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100/80">
                <div className="bg-gradient-to-br from-brand-orange/20 to-brand-orange/10 p-2.5 rounded-2xl">
                  <Receipt className="text-brand-orange" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-brand-dark">Payment Summary</h2>
                  <p className="text-sm text-brand-dark/60">Order breakdown</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Payment Method */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50/80 to-white rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-orange/10 p-2 rounded-xl">
                      <CreditCard className="text-brand-orange" size={18} />
                    </div>
                    <span className="font-bold text-brand-dark">Payment Method</span>
                  </div>
                  <span className="font-black text-brand-dark bg-white px-4 py-1.5 rounded-xl shadow-sm">
                    {paymentMethod}
                  </span>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-dark/70 font-medium">Subtotal</span>
                    <span className="text-brand-dark font-bold">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-dark/70 font-medium flex items-center gap-1">
                      <Truck size={14} className="text-brand-olive" />
                      Shipping
                    </span>
                    <span className="text-green-600 font-bold">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-dark/70 font-medium">Tax (8%)</span>
                    <span className="text-brand-dark font-bold">${(totalAmount * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-3 border-b border-gray-100/80">
                    <span className="text-brand-dark/70 font-medium">Discount</span>
                    <span className="text-red-500 font-bold">-$0.00</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-2">
                  <div>
                    <span className="font-bold text-brand-dark text-lg block">Total Amount</span>
                    <span className="text-xs text-brand-dark/40">Including all taxes</span>
                  </div>
                  <span className="font-black text-brand-olive text-3xl">${totalAmount.toFixed(2)}</span>
                </div>

                {/* Status Timeline */}
                <div className="mt-6 pt-6 border-t-2 border-gray-100/80">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={16} className="text-brand-orange" />
                    <span className="text-sm font-bold text-brand-dark">Order Timeline</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(orderStatus)} bg-opacity-100`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-brand-dark">{orderStatus}</p>
                        <p className="text-xs text-brand-dark/40">{formatDate(createdAt)}</p>
                      </div>
                    </div>
                    {orderStatus !== 'Pending' && (
                      <div className="flex items-center gap-3 opacity-60">
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-brand-dark/60">Order Confirmed</p>
                          <p className="text-xs text-brand-dark/30">{formatDate(createdAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-dark/40 bg-gray-50/50 p-3 rounded-2xl">
                  <ShieldCheck size={14} className="text-brand-orange" />
                  <span>Your order is protected by our secure system</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 flex items-center justify-around">
              <button 
                onClick={() => navigate('/products')}
                className="text-center group"
              >
                <div className="text-brand-orange font-bold text-lg group-hover:scale-110 transition-transform">Shop</div>
                <div className="text-xs text-brand-dark/40">More Products</div>
              </button>
              <div className="w-px h-10 bg-gray-200"></div>
              <button 
                onClick={() => navigate('/orders')}
                className="text-center group"
              >
                <div className="text-brand-orange font-bold text-lg group-hover:scale-110 transition-transform">Orders</div>
                <div className="text-xs text-brand-dark/40">View All</div>
              </button>
              <div className="w-px h-10 bg-gray-200"></div>
              <button 
                onClick={() => window.print()}
                className="text-center group"
              >
                <div className="text-brand-orange font-bold text-lg group-hover:scale-110 transition-transform">Print</div>
                <div className="text-xs text-brand-dark/40">Receipt</div>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ===== REVIEW MODAL ===== */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
            <div className="flex justify-between items-center p-6 border-b-2 border-gray-100/80">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-400/10 p-2 rounded-xl">
                  <Star className="text-yellow-400 fill-yellow-400" size={20} />
                </div>
                <h2 className="text-2xl font-black text-brand-dark">Rate & Review</h2>
              </div>
              <button 
                onClick={() => setIsReviewModalOpen(false)} 
                className="text-gray-400 hover:text-brand-dark transition-colors p-2 hover:bg-gray-100 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="p-6 space-y-6">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-3">Overall Rating</label>
                <div className="flex gap-3 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="focus:outline-none transition-all hover:scale-125"
                    >
                      <Star 
                        size={40} 
                        className={`transition-all duration-300 ${
                          star <= reviewData.rating 
                            ? "fill-yellow-400 text-yellow-400 drop-shadow-lg" 
                            : "fill-gray-200 text-gray-200 hover:fill-gray-300"
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-brand-dark/60 mt-2">
                  {reviewData.rating === 5 && '⭐ Excellent!'}
                  {reviewData.rating === 4 && '👍 Very Good!'}
                  {reviewData.rating === 3 && '👌 Okay'}
                  {reviewData.rating === 2 && '😕 Not Great'}
                  {reviewData.rating === 1 && '😡 Poor'}
                </p>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Your Review <span className="text-brand-dark/40 text-xs font-normal">(Optional)</span></label>
                <textarea 
                  rows="4" 
                  value={reviewData.reviewText}
                  onChange={(e) => setReviewData({ ...reviewData, reviewText: e.target.value })}
                  placeholder="What did you like or dislike about this product?"
                  className="w-full border-2 border-gray-200/80 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange bg-gray-50/50 hover:bg-white transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-brand-orange to-brand-orange/90 text-white font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-brand-orange/30 transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <><Loader2 size={20} className="animate-spin" /> Submitting...</>
                ) : (
                  <><Star size={20} className="group-hover:rotate-12 transition-transform" /> Submit Review</>
                )}
              </button>
              
              <p className="text-center text-xs text-brand-dark/40">
                Your review helps other customers make better decisions
              </p>
            </form>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9) translateY(20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}