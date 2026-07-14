// src/pages/OrderDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../store/orderSlice';
import { createReview } from '../store/reviewSlice';
import { 
  ArrowLeft, Package, Truck, MapPin, 
  CreditCard, Loader2, Store, Star, X
} from 'lucide-react';

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

export default function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentOrder, isLoading, error } = useSelector((state) => state.orders);
  const { isSubmitting } = useSelector((state) => state.reviews);

  // --- Modal State ---
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
      alert("Review submitted successfully!");
      setIsReviewModalOpen(false);
    } else {
      alert(resultAction.payload || "Failed to submit review");
    }
  };

  if (isLoading || !currentOrder) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50/50">
        <Loader2 className="animate-spin h-12 w-12 text-brand-orange" />
      </div>
    );
  }

  const { shippingAddress, items, totalAmount, paymentMethod, orderStatus, createdAt } = currentOrder;

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <button 
          onClick={() => navigate('/orders')} 
          className="flex items-center text-brand-dark/60 hover:text-brand-dark mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Orders
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-brand-dark">Order Details</h1>
            <p className="text-brand-dark/60 font-medium mt-1 flex items-center gap-2">
              Order #{currentOrder._id.toUpperCase()} 
              <span className="hidden sm:inline">•</span> 
              <span className="block sm:inline">{formatDate(createdAt)}</span>
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl border-2 text-sm font-black uppercase tracking-wider ${getStatusStyles(orderStatus)}`}>
            {orderStatus}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-8">
            {/* Products List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center gap-3">
                <Package className="text-brand-orange" size={24} />
                <h2 className="text-xl font-black text-brand-dark">Items in this Order</h2>
              </div>
              
              <div className="p-6 sm:p-8 space-y-6">
                {items.map((item) => (
                  <div key={item._id} className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-full sm:w-28 h-28 flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                      <img src={item.product?.images?.[0] || '/placeholder.png'} alt={item.product?.name} className="w-full h-full object-cover"/>
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-brand-dark hover:text-brand-orange cursor-pointer" onClick={() => navigate(`/products/${item.product._id}`)}>
                            {item.product?.name || 'Product Unavailable'}
                          </h3>
                          {item.seller && (
                            <p className="text-sm text-brand-dark/50 font-medium flex items-center gap-1 mt-1">
                              <Store size={14} /> Sold by: {item.seller.shopname}
                            </p>
                          )}
                        </div>
                        
                        {/* Write Review Button (Only if Delivered) */}
                        {orderStatus === 'Delivered' && item.product && (
                          <button 
                            onClick={() => openReviewModal(item.product._id)}
                            className="text-sm font-bold text-brand-orange hover:bg-brand-orange/10 px-4 py-2 rounded-lg transition-colors border border-brand-orange"
                          >
                            Write Review
                          </button>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-end mt-4 sm:mt-0">
                        <p className="text-brand-dark/70 font-medium">Qty: <span className="font-bold text-brand-dark">{item.quantity}</span></p>
                        <p className="text-xl font-black text-brand-dark">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center gap-3">
                <MapPin className="text-brand-olive" size={24} />
                <h2 className="text-xl font-black text-brand-dark">Delivery Address</h2>
              </div>
              <div className="p-6 sm:p-8">
                <p className="font-bold text-brand-dark text-lg mb-2">{shippingAddress.fullName}</p>
                <div className="text-brand-dark/70 font-medium space-y-1">
                  <p>{shippingAddress.address}</p>
                  <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
                  <p>{shippingAddress.country}</p>
                  <p className="pt-2 text-brand-dark flex items-center gap-2">
                    <Truck size={16} className="text-gray-400" /> {shippingAddress.phone}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-black text-brand-dark mb-6">Payment Summary</h2>
              
              <div className="space-y-4 text-brand-dark/70 font-medium pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-brand-dark" size={20} />
                    <span className="font-bold text-brand-dark">Method</span>
                  </div>
                  <span className="font-black text-brand-dark">{paymentMethod}</span>
                </div>

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-brand-dark font-bold">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
              </div>

              <div className="flex justify-between pt-6 items-center">
                <span className="font-bold text-brand-dark text-lg">Total Amount</span>
                <span className="font-black text-brand-olive text-3xl">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- REVIEW MODAL --- */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-black text-brand-dark">Rate & Review</h2>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-brand-dark transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="p-6 space-y-6">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-3">Overall Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={36} 
                        className={star <= reviewData.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Your Review (Optional)</label>
                <textarea 
                  rows="4" 
                  value={reviewData.reviewText}
                  onChange={(e) => setReviewData({ ...reviewData, reviewText: e.target.value })}
                  placeholder="What did you like or dislike about this product?"
                  className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-gray-50 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl hover:bg-brand-dark transition-colors flex justify-center items-center disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}