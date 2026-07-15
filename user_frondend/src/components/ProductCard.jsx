// src/components/ProductCard.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Loader2 } from 'lucide-react';
import { addToCart, addToWishlist } from '../store/productSlice'; // Import actions
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
    
    
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    await dispatch(addToCart(product._id)).unwrap()
      .then(() =>    toast.success("Added to cart"))
      .catch((err) => toast.error(err));
    setLoading(false);
  };

  const handleAddToWishlist = async () => {
    await dispatch(addToWishlist(product._id)).unwrap()
      .then(() => toast.success("Added to wishlist!"))
      .catch((err) => toast.error(err));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 flex flex-col">
      <div className="h-56 bg-brand-light/20 relative overflow-hidden group">
        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        
<button
  onClick={handleAddToWishlist}
  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur transition-colors ${
    product.isWishlisted
      ? "bg-red-100 text-red-500"
      : "bg-white/80 text-brand-dark hover:bg-red-50 hover:text-red-500"
  }`}
>
  <Heart
    size={20}
    fill={product.isWishlisted ? "currentColor" : "none"}
  />
</button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider">{product.brand}</span>
        <h3 className="font-bold text-brand-dark mt-1 truncate">{product.name}</h3>
        
        <div className="flex items-center justify-between mt-4 mb-4">
          <span className="text-xl font-black text-brand-olive">${product.price}</span>
          <span className={`text-xs font-bold px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button 
            onClick={handleAddToCart}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-brand-orange text-white py-2 rounded-xl text-xs font-bold hover:bg-brand-dark transition-colors"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />} 
            Add
          </button>
          
          <button 
            onClick={() => navigate(`/products/${product._id}`)}
            className="flex items-center justify-center gap-2 bg-brand-dark text-white py-2 rounded-xl text-xs font-bold hover:bg-brand-orange transition-colors"
          >
            <Eye size={14} /> View
          </button>
        </div>
      </div>
    </div>
  );
}