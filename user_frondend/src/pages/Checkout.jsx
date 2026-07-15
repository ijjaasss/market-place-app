// src/pages/Checkout.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart } from '../store/cartSlice';
import { placeOrder, clearOrderError } from '../store/orderSlice';
import { 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  ShieldCheck,
  Truck,
  Clock,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Wallet,
  Building2,
  Phone,
  Mail,
  User,
  Home
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, subtotal, isLoading } = useSelector((state) => state.cart);
  const { isProcessing, error } = useSelector((state) => state.orders);

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
  });

  // Calculate Totals
  const shipping = subtotal > 0 ? 15.00 : 0;
  const total = subtotal + shipping;
  const tax = subtotal * 0.08; // 8% tax
  const grandTotal = total + tax;

  useEffect(() => {
    dispatch(fetchCart());
    return () => dispatch(clearOrderError());
  }, [dispatch]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && items.length === 0 && !isProcessing) {
      navigate('/cart');
    }
  }, [items, isLoading, isProcessing, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      shippingAddress: formData,
      paymentMethod,
    };

    const resultAction = await dispatch(placeOrder(payload));
    
    if (placeOrder.fulfilled.match(resultAction)) {
      toast.success("order placed")
      navigate('/orders');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-light/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full border-4 border-brand-orange/20 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-brand-orange border-t-transparent animate-spin"></div>
            </div>
          </div>
          <p className="text-brand-dark/60 font-medium mt-6 animate-pulse">Loading checkout...</p>
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
                <ShieldCheck className="h-4 w-4 text-brand-orange" />
                <span className="text-white/90 text-sm font-medium">Secure Checkout</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
                Checkout <span className="text-brand-orange">Now</span>
              </h1>
              <p className="text-brand-light/80 mt-2 text-lg">
                Complete your purchase with confidence
              </p>
            </div>

            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-2xl border border-white/20 transition-all duration-300 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Cart</span>
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {error && (
          <div className="mb-6 p-5 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 shadow-lg">
            <AlertCircle size={24} className="flex-shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* 1. Shipping Address Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50 hover:shadow-3xl transition-shadow duration-500">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-gray-100/80">
                <div className="bg-gradient-to-br from-brand-orange/20 to-brand-orange/10 p-3 rounded-2xl">
                  <MapPin size={24} className="text-brand-orange" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-brand-dark">Shipping Address</h2>
                  <p className="text-sm text-brand-dark/60">Where should we deliver your order?</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                  <CheckCircle2 size={14} />
                  <span>Secure</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-brand-dark mb-2 flex items-center gap-2">
                    <User size={16} className="text-brand-orange" />
                    Full Name *
                  </label>
                  <input 
                    required 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    className="w-full border-2 border-gray-200/80 py-3.5 px-5 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                    placeholder="John Doe" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-brand-dark mb-2 flex items-center gap-2">
                    <Phone size={16} className="text-brand-orange" />
                    Mobile Number *
                  </label>
                  <input 
                    required 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    className="w-full border-2 border-gray-200/80 py-3.5 px-5 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                    placeholder="+91 9876543210" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-brand-dark mb-2 flex items-center gap-2">
                    <Home size={16} className="text-brand-orange" />
                    Full Address *
                  </label>
                  <textarea 
                    required 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    rows="3" 
                    className="w-full border-2 border-gray-200/80 py-3.5 px-5 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all bg-gray-50/50 hover:bg-white focus:bg-white resize-none"
                    placeholder="House/Flat No., Building Name, Street..." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2 flex items-center gap-2">
                    <Building2 size={16} className="text-brand-orange" />
                    City *
                  </label>
                  <input 
                    required 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    className="w-full border-2 border-gray-200/80 py-3.5 px-5 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                    placeholder="New York" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">State *</label>
                  <input 
                    required 
                    type="text" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleInputChange} 
                    className="w-full border-2 border-gray-200/80 py-3.5 px-5 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                    placeholder="California" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">Pincode *</label>
                  <input 
                    required 
                    type="text" 
                    name="pincode" 
                    value={formData.pincode} 
                    onChange={handleInputChange} 
                    className="w-full border-2 border-gray-200/80 py-3.5 px-5 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                    placeholder="10001" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">Country *</label>
                  <input 
                    required 
                    type="text" 
                    name="country" 
                    value={formData.country} 
                    onChange={handleInputChange} 
                    className="w-full border-2 border-gray-200/80 py-3.5 px-5 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
                    placeholder="United States" 
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50 hover:shadow-3xl transition-shadow duration-500">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-gray-100/80">
                <div className="bg-gradient-to-br from-brand-olive/20 to-brand-olive/10 p-3 rounded-2xl">
                  <CreditCard size={24} className="text-brand-olive" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-brand-dark">Payment Method</h2>
                  <p className="text-sm text-brand-dark/60">Choose how you want to pay</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-xs text-brand-orange bg-brand-orange/10 px-3 py-1.5 rounded-full">
                  <ShieldCheck size={14} />
                  <span>100% Secure</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`relative flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  paymentMethod === 'COD' 
                    ? 'border-brand-olive bg-gradient-to-br from-brand-olive/10 to-brand-olive/5 shadow-lg' 
                    : 'border-gray-200 hover:border-brand-olive/30 hover:bg-gray-50/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="COD" 
                      checked={paymentMethod === 'COD'} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                      className="w-5 h-5 text-brand-olive focus:ring-brand-olive border-gray-300" 
                    />
                    <div>
                      <span className="font-bold text-brand-dark text-lg block">Cash on Delivery</span>
                      <span className="text-xs text-brand-dark/50">Pay when you receive</span>
                    </div>
                  </div>
                  {paymentMethod === 'COD' && (
                    <CheckCircle2 className="text-brand-olive animate-scaleIn" size={20} />
                  )}
                </label>

                <label className={`relative flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  paymentMethod === 'Online' 
                    ? 'border-brand-olive bg-gradient-to-br from-brand-olive/10 to-brand-olive/5 shadow-lg' 
                    : 'border-gray-200 hover:border-brand-olive/30 hover:bg-gray-50/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="Online" 
                      checked={paymentMethod === 'Online'} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                      className="w-5 h-5 text-brand-olive focus:ring-brand-olive border-gray-300" 
                    />
                    <div>
                      <span className="font-bold text-brand-dark text-lg block">Online Payment</span>
                      <span className="text-xs text-brand-dark/50">Credit/Debit Card</span>
                    </div>
                  </div>
                  {paymentMethod === 'Online' && (
                    <CheckCircle2 className="text-brand-olive animate-scaleIn" size={20} />
                  )}
                </label>
              </div>

              {/* Payment Icons */}
              <div className="mt-4 flex items-center justify-center gap-4 opacity-60">
                <span className="text-xs text-brand-dark/40 font-medium">Secure payments via</span>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-brand-dark/60">VISA</div>
                  <div className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-brand-dark/60">MASTERCARD</div>
                  <div className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-brand-dark/60">PAYPAL</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Order Summary Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100/80">
                  <div className="bg-gradient-to-br from-brand-orange/20 to-brand-orange/10 p-2.5 rounded-2xl">
                    <ShoppingBag size={20} className="text-brand-orange" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-brand-dark">Order Summary</h2>
                    <span className="text-sm text-brand-dark/60">{items.length} items</span>
                  </div>
                </div>
                
                {/* Item List */}
                <div className="max-h-[280px] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex gap-4 items-center group hover:bg-gray-50/50 p-2 rounded-xl transition-all duration-300">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-brand-light/20 to-brand-light/10 flex-shrink-0 border border-gray-100 shadow-sm">
                        <img 
                          src={item.product.images?.[0]} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-brand-dark truncate">{item.product.name}</p>
                        <div className="flex items-center gap-2 text-xs text-brand-dark/60 font-medium mt-0.5">
                          <span>Qty: {item.quantity}</span>
                          <span className="w-1 h-1 rounded-full bg-brand-dark/20"></span>
                          <span className="text-brand-orange font-bold">${(item.product.price).toFixed(2)}</span>
                        </div>
                      </div>
                      <p className="font-black text-sm text-brand-dark">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Details */}
                <div className="pt-4 border-t-2 border-gray-100/80 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-dark/70 font-medium">Subtotal</span>
                    <span className="text-brand-dark font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-dark/70 font-medium flex items-center gap-1">
                      <Truck size={14} className="text-brand-olive" />
                      Shipping
                    </span>
                    <span className="text-brand-dark font-bold">
                      {shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-dark/70 font-medium">Tax (8%)</span>
                    <span className="text-brand-dark font-bold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-100/80">
                    <span className="text-lg font-bold text-brand-dark">Total</span>
                    <span className="text-2xl font-black text-brand-olive">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="group w-full mt-6 bg-gradient-to-r from-brand-orange to-brand-orange/90 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-brand-orange/30 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={22} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </button>
                
                {/* Trust Badges */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-brand-dark/40">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-brand-orange" />
                    <span>256-bit encrypted</span>
                  </div>
                  <div className="w-px h-4 bg-gray-200"></div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-brand-olive" />
                    <span>30-day returns</span>
                  </div>
                </div>
                
                <p className="text-[10px] text-center text-brand-dark/40 mt-3 font-medium">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </div>

              {/* Delivery Info Card */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 flex items-center justify-around">
                <div className="text-center">
                  <div className="text-brand-orange font-bold text-lg">Free</div>
                  <div className="text-xs text-brand-dark/60">Delivery</div>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-brand-orange font-bold text-lg">100%</div>
                  <div className="text-xs text-brand-dark/60">Secure</div>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-brand-orange font-bold text-lg">24/7</div>
                  <div className="text-xs text-brand-dark/60">Support</div>
                </div>
              </div>
            </div>
          </div>

        </form>
      </section>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D96846;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2F3020;
        }
      `}</style>
    </div>
  );
}