// src/pages/Wishlist.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWishlist, removeWishlistItem } from '../store/wishlistSlice';

import { addToCart } from '../store/productSlice';
import { 
  Heart, 
  Search, 
  Trash2, 
  ShoppingCart, 
  Loader2, 
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { fetchCart } from '../store/cartSlice';

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, isLoading } = useSelector((state) => state.wishlist);
  const { items: cartItems } = useSelector((state) => state.cart); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [processingId, setProcessingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchWishlist());
    dispatch(fetchCart())
  }, [dispatch]);

  const isInCart = (productId) => {
    return cartItems.some(cartItem => cartItem.product._id === productId);
  };

  const handleRemove = (productId) => {
    dispatch(removeWishlistItem(productId));
  };

  const handleMoveToCart = async (productId) => {
    setProcessingId(productId);
    await dispatch(addToCart(productId)).unwrap();
  
    setProcessingId(null);
  };

  let processedItems = [...items];

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    processedItems = processedItems.filter(item => 
      item.product.name?.toLowerCase().includes(query) || 
      item.product.brand?.toLowerCase().includes(query)
    );
  }

  switch (sortBy) {
    case 'oldest':
      break;
    case 'newest':
      processedItems.reverse();
      break;
    case 'price-low':
      processedItems.sort((a, b) => a.product.price - b.product.price);
      break;
    case 'price-high':
      processedItems.sort((a, b) => b.product.price - a.product.price);
      break;
    case 'name-asc':
      processedItems.sort((a, b) => a.product.name.localeCompare(b.product.name));
      break;
    default:
      processedItems.reverse();
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-light/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full border-4 border-brand-orange/20 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-brand-orange border-t-transparent animate-spin"></div>
            </div>
          </div>
          <p className="text-brand-dark/60 font-medium mt-6 animate-pulse">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

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
                <Heart className="h-4 w-4 text-brand-orange fill-brand-orange" />
                <span className="text-white/90 text-sm font-medium">Your Favorites</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
                My <span className="text-brand-orange">Wishlist</span>
              </h1>
              <p className="text-brand-light/80 mt-2 text-lg">
                {items.length > 0 ? (
                  <>You have <span className="text-brand-orange font-bold">{items.length}</span> items saved</>
                ) : (
                  'Start saving your favorite products'
                )}
              </p>
            </div>

            {items.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-5 py-3 rounded-2xl border border-white/20 transition-all duration-300"
                >
                  <Filter className="h-4 w-4" />
                  <span className="font-medium">Filter</span>
                  <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-90' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        /* ===== EMPTY WISHLIST ===== */
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 md:p-20 text-center border border-white/50">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-brand-light/40 to-brand-light/10 mb-8">
              <Heart size={56} className="text-brand-dark/30" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Your wishlist is empty</h2>
            <p className="text-brand-dark/60 text-lg max-w-md mx-auto mb-8">
              Start exploring our collection and save your favorite items to your wishlist.
            </p>
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange/90 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-brand-orange/30 transition-all duration-300 transform hover:scale-105"
            >
              Start Shopping
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      ) : (
        /* ===== WISHLIST WITH ITEMS ===== */
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          
          {/* Filter/Search Bar */}
          {showFilters && (
            <div className="mb-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50 animate-slideDown">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search your wishlist..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border border-gray-200 py-3 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white/50"
                    />
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-brand-dark transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="md:w-64">
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Sort By</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-200 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white/50 cursor-pointer"
                  >
                    <option value="newest">✨ Newest</option>
                    <option value="oldest">📅 Oldest</option>
                    <option value="price-low">💰 Price: Low to High</option>
                    <option value="price-high">💰 Price: High to Low</option>
                    <option value="name-asc">📝 Name: A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats Bar */}
          {!showFilters && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="text-brand-dark/70 text-sm font-medium">
                  Showing <span className="text-brand-dark font-bold">{processedItems.length}</span> of{' '}
                  <span className="text-brand-dark font-bold">{items.length}</span> items
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-brand-dark/40">Sort: </span>
                <span className="text-xs font-semibold text-brand-dark bg-white px-3 py-1 rounded-full">
                  {sortBy.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Wishlist Grid */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50">
            {processedItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-light/30 mb-4">
                  <Search size={32} className="text-brand-dark/30" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-2">No items match your search</h3>
                <p className="text-brand-dark/60">Try adjusting your search terms</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-brand-orange font-semibold hover:underline"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {processedItems.map(({ product, isAvailable }, index) => {
                  const inCart = isInCart(product._id);
                  
                  return (
                    <div 
                      key={product._id} 
                      className="group bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-brand-orange/20 hover:-translate-y-1 animate-fadeIn"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Image Area */}
                      <div 
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="relative h-64 bg-gradient-to-br from-brand-light/30 to-brand-light/10 overflow-hidden cursor-pointer"
                      >
                        <img 
                          src={product.images?.[0]} 
                          alt={product.name} 
                          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${!isAvailable ? 'grayscale opacity-70' : ''}`} 
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {!isAvailable && (
                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                              Out of Stock
                            </span>
                          )}
                          {product.discount && (
                            <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                              -{product.discount}%
                            </span>
                          )}
                        </div>
                        
                        {/* Heart Icon */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <Heart className="fill-brand-orange text-brand-orange" size={20} />
                        </div>
                        
                        {/* Quick View Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button 
                            onClick={() => navigate(`/products/${product._id}`)}
                            className="bg-white/90 backdrop-blur-sm text-brand-dark px-6 py-3 rounded-2xl font-bold hover:bg-white transition-all transform hover:scale-105 shadow-xl"
                          >
                            Quick View
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-1 flex items-center gap-2">
                          <span>{product.brand || 'Brand'}</span>
                          <span className="w-1 h-1 rounded-full bg-brand-dark/20"></span>
                          <span className="text-brand-orange">★ 4.8</span>
                        </div>
                        
                        <h3 
                          onClick={() => navigate(`/products/${product._id}`)}
                          className="font-bold text-lg text-brand-dark truncate cursor-pointer hover:text-brand-orange transition-colors"
                        >
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center justify-between mt-3 mb-4">
                          <div>
                            <span className="text-2xl font-black text-brand-olive">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-brand-dark/40 line-through ml-2">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                            isAvailable 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {isAvailable ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-1 gap-2.5 mt-auto">
                          {inCart ? (
                            <button 
                              onClick={() => navigate('/cart')}
                              className="group/btn w-full flex items-center justify-center gap-2 bg-brand-dark text-white py-3 rounded-2xl text-sm font-bold hover:bg-brand-olive transition-all duration-300"
                            >
                              Go to Cart 
                              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleMoveToCart(product._id)}
                              disabled={!isAvailable || processingId === product._id}
                              className="group/btn w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange/90 text-white py-3 rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-brand-orange/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {processingId === product._id ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
                              )} 
                              Move to Cart
                            </button>
                          )}
                          
                          <button 
                            onClick={() => handleRemove(product._id)}
                            className="group/remove w-full flex items-center justify-center gap-2 text-gray-400 hover:text-red-500 hover:bg-red-50 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
                          >
                            <Trash2 size={16} className="group-hover/remove:scale-110 transition-transform" /> 
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          {items.length > 0 && (
            <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/50 text-center">
              <p className="text-brand-dark/60 text-sm mb-3">Found something you like?</p>
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 text-brand-orange font-bold hover:gap-3 transition-all duration-300 group"
              >
                Explore More Products
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </section>
      )}

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
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}