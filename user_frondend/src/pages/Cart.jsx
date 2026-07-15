// src/pages/Cart.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../store/cartSlice';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  Loader2,
  ShoppingCart,
  CreditCard,
  Truck,
  ShieldCheck,
  X,
  ChevronRight
} from 'lucide-react';

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
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-light/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full border-4 border-brand-orange/20 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-brand-orange border-t-transparent animate-spin"></div>
            </div>
          </div>
          <p className="text-brand-dark/60 font-medium mt-6 animate-pulse">Loading your cart...</p>
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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-4">
                <ShoppingCart className="h-4 w-4 text-brand-orange" />
                <span className="text-white/90 text-sm font-medium">Your Cart</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
                Shopping <span className="text-brand-orange">Cart</span>
              </h1>
              <p className="text-brand-light/80 mt-2 text-lg">
                {itemsCount > 0 ? (
                  <>You have <span className="text-brand-orange font-bold">{itemsCount}</span> items in your cart</>
                ) : (
                  'Your cart is waiting for you'
                )}
              </p>
            </div>

            {items.length > 0 && (
              <button 
                onClick={() => dispatch(clearCart())}
                className="group flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-red-500/20 text-white hover:text-red-400 px-6 py-3 rounded-2xl border border-white/20 hover:border-red-400/50 transition-all duration-300"
              >
                <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Clear All</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        /* ===== EMPTY CART ===== */
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 md:p-20 text-center border border-white/50">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-brand-light/40 to-brand-light/10 mb-8">
              <ShoppingBag size={56} className="text-brand-dark/30" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Your cart is empty</h2>
            <p className="text-brand-dark/60 text-lg max-w-md mx-auto mb-8">
              Looks like you haven't added any items to your cart yet. Start shopping now!
            </p>
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange/90 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-brand-orange/30 transition-all duration-300 transform hover:scale-105"
            >
              Continue Shopping
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      ) : (
        /* ===== CART WITH ITEMS ===== */
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50">
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100/80">
                  <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-brand-orange" />
                    Cart Items ({itemsCount})
                  </h2>
                  <span className="text-sm text-brand-dark/60 font-medium">
                    {items.length} products
                  </span>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div 
                      key={item.product._id} 
                      className="group bg-gradient-to-br from-white to-gray-50/50 p-4 sm:p-5 rounded-2xl border border-gray-100 hover:border-brand-orange/20 hover:shadow-xl transition-all duration-300 flex items-center gap-4 sm:gap-6 relative animate-fadeIn"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Product Image */}
                      <div className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-light/20 to-brand-light/10 shadow-md">
                        <img 
                          src={item.product.images?.[0]} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow min-w-0">
                        <Link to={`/products/${item.product._id}`} className="block">
                          <h3 className="font-bold text-brand-dark hover:text-brand-orange transition-colors truncate text-lg">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-brand-dark/50 font-medium">{item.product.brand}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xl font-black text-brand-olive">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <span className="text-sm text-brand-dark/40 line-through">
                            ${(item.product.price * item.quantity * 1.2).toFixed(2)}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            Save 20%
                          </span>
                        </div>
                      </div>

                      {/* Right Side: Quantity & Remove */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center bg-gray-100/80 rounded-2xl p-1 border border-gray-200 group-hover:border-brand-orange/30 transition-colors">
                          <button 
                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1, item.product.stock)}
                            disabled={item.quantity <= 1 || updatingId === item.product._id}
                            className="p-2 hover:bg-white rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <Minus size={16} className="text-brand-dark/60" />
                          </button>
                          <span className="w-10 text-center font-bold text-brand-dark text-sm">
                            {updatingId === item.product._id ? (
                              <Loader2 size={16} className="animate-spin mx-auto text-brand-orange" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button 
                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1, item.product.stock)}
                            disabled={item.quantity >= item.product.stock || updatingId === item.product._id}
                            className="p-2 hover:bg-white rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <Plus size={16} className="text-brand-dark/60" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => dispatch(removeCartItem(item.product._id))}
                          className="group/remove text-gray-400 hover:text-red-500 transition-all duration-300 p-1.5 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 size={18} className="group-hover/remove:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping Link */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link 
                    to="/products" 
                    className="inline-flex items-center gap-2 text-brand-orange font-semibold hover:gap-3 transition-all duration-300 group"
                  >
                    <ChevronRight className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-4">
                {/* Summary Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50">
                  <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-brand-orange" />
                    Order Summary
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-brand-dark/70 font-medium">Subtotal</span>
                      <span className="text-brand-dark font-bold text-lg">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-brand-dark/70 font-medium flex items-center gap-2">
                        <Truck className="h-4 w-4 text-brand-olive" />
                        Shipping
                      </span>
                      <span className="text-brand-dark font-bold">${shipping.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-brand-dark/70 font-medium flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-brand-orange" />
                        Insurance
                      </span>
                      <span className="text-brand-dark font-bold text-green-600">Free</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 mt-2">
                      <span className="text-xl font-bold text-brand-dark">Total</span>
                      <span className="text-3xl font-black text-brand-olive">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/checkout')}
                    className="group w-full mt-8 bg-gradient-to-r from-brand-orange to-brand-orange/90 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-brand-orange/30 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-dark/40">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Secure checkout • 100% protected</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-brand-orange font-bold text-lg">100%</div>
                    <div className="text-xs text-brand-dark/60">Secure</div>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-brand-orange font-bold text-lg">24/7</div>
                    <div className="text-xs text-brand-dark/60">Support</div>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-brand-orange font-bold text-lg">30</div>
                    <div className="text-xs text-brand-dark/60">Days Return</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
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
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}