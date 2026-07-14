// src/pages/ProductDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, clearProductDetails, addToCart, addToWishlist } from '../store/productSlice';
import { fetchProductReviews, clearReviews, deleteReview } from '../store/reviewSlice';
import { Loader2, ShoppingCart, Heart, ShieldCheck, Truck, ArrowLeft, Star, User, Trash2 } from 'lucide-react';

// Helper component for star ratings
const StarRating = ({ rating, size = 16 }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { currentProduct, isDetailsLoading } = useSelector((state) => state.products);
  const { items: reviews, summary, isLoading: isReviewsLoading } = useSelector((state) => state.reviews);
  
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    dispatch(fetchProductReviews({ productId: id }));
    
    return () => {
      dispatch(clearProductDetails());
      dispatch(clearReviews());
    };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart(currentProduct._id));
  };

  const handleAddToWishlist = async () => {
    await dispatch(addToWishlist(currentProduct._id));
  };

  if (isDetailsLoading || !currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-brand-dark/60 hover:text-brand-dark mb-8 font-medium transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Products
        </button>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          
          {/* Left: Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden">
              <img 
                src={currentProduct.images[activeImage]} 
                alt={currentProduct.name} 
                className="w-full h-full object-contain p-8"
              />
            </div>
            {/* Thumbnail Strip */}
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {currentProduct.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-brand-olive' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            <span className="text-brand-olive font-bold uppercase tracking-widest text-sm mb-2">{currentProduct.brand}</span>
            <h1 className="text-4xl sm:text-5xl font-black text-brand-dark mb-4">{currentProduct.name}</h1>
            
            {/* Quick Rating Summary */}
            {summary.totalReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={Math.round(summary.averageRating)} />
                <span className="text-brand-dark/70 font-medium">
                  {summary.averageRating} ({summary.totalReviews} reviews)
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-black text-brand-dark">₹{currentProduct.price.toLocaleString()}</span>
              {currentProduct.stock > 0 ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">In Stock ({currentProduct.stock})</span>
              ) : (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">Out of Stock</span>
              )}
            </div>

            <p className="text-brand-dark/70 text-lg leading-relaxed mb-8">{currentProduct.description}</p>

            {/* Seller Info */}
            <div className="bg-brand-light/20 p-6 rounded-2xl mb-8 flex items-center gap-4 border border-brand-light/40">
              <img src={currentProduct.seller.logo} alt="shop logo" className="w-12 h-12 rounded-full object-cover bg-white" />
              <div>
                <p className="font-bold text-brand-dark">Sold by {currentProduct.seller.shopname}</p>
                <p className="text-sm text-brand-dark/60">{currentProduct.seller.city}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={currentProduct.stock <= 0}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={22} /> Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className={`px-6 py-4 rounded-xl border-2 transition-all ${
                  currentProduct.isWishlisted
                    ? "bg-red-50 text-red-500 border-red-500"
                    : "border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500"
                }`}
              >
                <Heart size={24} fill={currentProduct.isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Truck className="text-brand-olive" />
                <span className="text-sm font-bold text-brand-dark">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-brand-olive" />
                <span className="text-sm font-bold text-brand-dark">Genuine Product</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-100 pt-16">
          <h2 className="text-3xl font-black text-brand-dark mb-10">Customer Reviews</h2>

          {isReviewsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-brand-orange h-8 w-8" />
            </div>
          ) : summary.totalReviews === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
              <p className="text-lg font-medium text-brand-dark/60">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              
              {/* Left Column: Review Summary */}
              <div className="md:col-span-4 lg:col-span-3">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sticky top-24">
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-5xl font-black text-brand-dark">{summary.averageRating}</span>
                    <span className="text-lg font-medium text-brand-dark/60 mb-1">/ 5</span>
                  </div>
                  
                  <div className="mb-6">
                    <StarRating rating={Math.round(summary.averageRating)} size={24} />
                    <p className="text-sm font-medium text-brand-dark/60 mt-2">Based on {summary.totalReviews} reviews</p>
                  </div>

                  {/* Rating Breakdown Bars */}
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = summary.ratingBreakdown[rating] || 0;
                      const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
                      
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm font-bold text-brand-dark w-3">{rating}</span>
                          <Star size={12} className="fill-brand-dark text-brand-dark" />
                          <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-brand-dark/50 w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Review List */}
              <div className="md:col-span-8 lg:col-span-9 space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                    
                    {/* DELETE BUTTON */}
                    {user && review.user?._id === user._id && (
                      <button 
                        onClick={async () => {
                          if(window.confirm("Are you sure you want to delete your review?")) {
                            await dispatch(deleteReview(review._id));
                            dispatch(fetchProductReviews({ productId: id }));
                          }
                        }}
                        className="absolute top-6 right-6 text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-full transition-colors"
                        title="Delete your review"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-dark">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-brand-dark">{review.user?.name || 'Anonymous'}</p>
                          <p className="text-xs text-brand-dark/50 font-medium">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Push stars left if delete button exists so they don't overlap */}
                      <div className={user && review.user?._id === user._id ? "mr-10" : ""}>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    
                    {review.review && (
                      <p className="text-brand-dark/80 leading-relaxed mt-4 pr-8">
                        {review.review}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}