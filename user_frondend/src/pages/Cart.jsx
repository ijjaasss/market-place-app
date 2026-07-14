// src/pages/Cart.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../store/cartSlice';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, subtotal, isLoading } = useSelector((state) => state.cart);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const itemsCount = items.reduce((total, item) => total + item.quantity, 0);
  const shipping = subtotal > 0 ? 15.00 : 0; 
  const total = subtotal + shipping;

  const handleQuantityChange = async (productId, newQty, maxStock) => {
    if (newQty < 1 || newQty > maxStock) return;
    setUpdatingId(productId);
    await dispatch(updateCartItem({ productId, quantity: newQty }));
    setUpdatingId(null);
  };

  if (isLoading && items.length === 0) {
    return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin h-10 w-10 text-brand-orange" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-brand-dark">Shopping Cart</h1>
            <p className="text-brand-dark/60 font-medium">{itemsCount} Items in your cart</p>
          </div>
          {items.length > 0 && (
            <button 
              onClick={() => dispatch(clearCart())}
              className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} /> Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-gray-100">
            <ShoppingBag size={64} className="mx-auto text-brand-light mb-6" />
            <h2 className="text-2xl font-bold text-brand-dark mb-2">Your cart is empty</h2>
            <Link to="/products" className="inline-block mt-4 bg-brand-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Items */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.product._id} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 sm:gap-6 relative">
                  {/* Image */}
                  <div className="h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                    <img src={item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-brand-dark truncate">{item.product.name}</h3>
                    <p className="text-sm text-brand-dark/50 font-medium">{item.product.brand}</p>
                    <p className="text-lg font-black text-brand-olive mt-1">${item.product.price.toFixed(2)}</p>
                  </div>

                  {/* Right Side: Quantity & Remove */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                      <button 
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1, item.product.stock)}
                        disabled={item.quantity <= 1 || updatingId === item.product._id}
                        className="p-1.5 hover:bg-white rounded-lg disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">
                        {updatingId === item.product._id ? <Loader2 size={14} className="animate-spin mx-auto" /> : item.quantity}
                      </span>
                      <button 
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1, item.product.stock)}
                        disabled={item.quantity >= item.product.stock || updatingId === item.product._id}
                        className="p-1.5 hover:bg-white rounded-lg disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => dispatch(removeCartItem(item.product._id))}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
                <h2 className="text-xl font-black text-brand-dark mb-6">Order Summary</h2>
                <div className="space-y-4 text-brand-dark/70 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-brand-dark font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-4">
                    <span>Shipping</span>
                    <span className="text-brand-dark font-bold">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-lg">
                    <span className="font-bold text-brand-dark">Total</span>
                    <span className="font-black text-brand-olive text-2xl">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-8 bg-brand-orange text-white py-4 rounded-2xl font-bold text-lg hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
                >
                  Checkout <ArrowRight size={20} />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}