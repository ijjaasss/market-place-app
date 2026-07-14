// src/pages/Wishlist.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWishlist, removeWishlistItem } from '../store/wishlistSlice';
import { addToCart } from '../store/productSlice'; // Assuming addToCart is here based on your previous code
import { Heart, Search, Trash2, ShoppingCart, Loader2, ArrowRight } from 'lucide-react';

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, isLoading } = useSelector((state) => state.wishlist);
  const { items: cartItems } = useSelector((state) => state.cart); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  // Helper to check if an item is already in the cart
  const isInCart = (productId) => {
    return cartItems.some(cartItem => cartItem.product._id === productId);
  };

  const handleRemove = (productId) => {
    dispatch(removeWishlistItem(productId));
  };

  const handleMoveToCart = async (productId) => {
    setProcessingId(productId);
    await dispatch(addToCart(productId)).unwrap();
    await handleRemove(productId)
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
      processedItems.reverse(); // Default newest
  }

  if (isLoading && items.length === 0) {
    return <div className="min-h-[50vh] flex justify-center items-center"><Loader2 className="animate-spin h-10 w-10 text-brand-orange" /></div>;
  }

  return (
    <div className="min-h-screen bg-brand-light/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-brand-dark flex items-center gap-3">
              <Heart className="fill-brand-orange text-brand-orange" size={32} /> 
              Wishlist
            </h1>
            <p className="text-brand-dark/70 mt-1 font-medium">{items.length} Items saved</p>
          </div>

          {items.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-200 py-2.5 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange shadow-sm"
                />
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange shadow-sm bg-white cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
              </select>
            </div>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100 mt-8">
            <Heart size={64} className="mx-auto text-brand-light mb-6 stroke-[1.5]" />
            <h2 className="text-2xl font-bold text-brand-dark mb-2">Your wishlist is empty</h2>
            <p className="text-brand-dark/60 mb-8">Save products you like to view them later.</p>
            <Link to="/products" className="inline-block bg-brand-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedItems.length === 0 ? (
               <div className="col-span-full py-12 text-center text-brand-dark/60 font-medium">
                 No items match your search.
               </div>
            ) : (
              processedItems.map(({ product, isAvailable }) => {
                const inCart = isInCart(product._id);
                
                return (
                  <div key={product._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 flex flex-col group relative">
                    
                    {/* Image Area */}
                    <div 
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="h-56 bg-brand-light/20 relative overflow-hidden cursor-pointer"
                    >
                      <img 
                        src={product.images?.[0]} 
                        alt={product.name} 
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!isAvailable ? 'grayscale opacity-70' : ''}`} 
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                         {!isAvailable && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Out of Stock</span>}
                      </div>
                      <Heart className="absolute top-3 right-3 fill-brand-orange text-brand-orange drop-shadow-md" size={24} />
                    </div>

                    {/* Details */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-1">
                        {product.brand || 'Brand'}
                      </div>
                      <h3 
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="font-bold text-lg text-brand-dark truncate cursor-pointer hover:text-brand-orange transition-colors"
                      >
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mt-3 mb-5">
                        <span className="text-xl font-black text-brand-olive">${product.price.toFixed(2)}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-1 gap-3 mt-auto">
                        {inCart ? (
                          <button 
                            onClick={() => navigate('/cart')}
                            className="w-full flex items-center justify-center gap-2 bg-brand-dark text-white py-2.5 rounded-xl text-sm font-bold hover:bg-opacity-90 transition-colors"
                          >
                            Go to Cart <ArrowRight size={16} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleMoveToCart(product._id)}
                            disabled={!isAvailable || processingId === product._id}
                            className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white py-2.5 rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingId === product._id ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />} 
                            Move to Cart
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleRemove(product._id)}
                          className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-red-500 hover:bg-red-50 py-2.5 rounded-xl text-sm font-bold transition-colors"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}