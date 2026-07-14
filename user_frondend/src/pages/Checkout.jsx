// src/pages/Checkout.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart } from '../store/cartSlice';
import { placeOrder, clearOrderError } from '../store/orderSlice';
import { MapPin, CreditCard, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

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
      // Navigate to a success page or orders page
      navigate('/orders'); 
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin h-10 w-10 text-brand-orange" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-brand-dark">Secure Checkout</h1>
          <p className="text-brand-dark/60 font-medium mt-1">Please enter your shipping and payment details.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="font-bold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            
            {/* 1. Shipping Address Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-brand-orange/10 p-2 rounded-lg text-brand-orange">
                  <MapPin size={24} />
                </div>
                <h2 className="text-xl font-black text-brand-dark">1. Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-brand-dark mb-2">Full Name *</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full border border-gray-200 py-3 px-4 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all bg-gray-50/50" placeholder="John Doe" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-brand-dark mb-2">Mobile Number *</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-200 py-3 px-4 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all bg-gray-50/50" placeholder="+91 9876543210" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-brand-dark mb-2">Full Address *</label>
                  <textarea required name="address" value={formData.address} onChange={handleInputChange} rows="3" className="w-full border border-gray-200 py-3 px-4 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all bg-gray-50/50 resize-none" placeholder="House/Flat No., Building Name, Street..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">City *</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-200 py-3 px-4 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all bg-gray-50/50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">State *</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full border border-gray-200 py-3 px-4 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all bg-gray-50/50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">Pincode *</label>
                  <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full border border-gray-200 py-3 px-4 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all bg-gray-50/50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">Country *</label>
                  <input required type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full border border-gray-200 py-3 px-4 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all bg-gray-50/50" />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-brand-olive/10 p-2 rounded-lg text-brand-olive">
                  <CreditCard size={24} />
                </div>
                <h2 className="text-xl font-black text-brand-dark">2. Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`relative flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-brand-olive bg-brand-olive/5' : 'border-gray-200 hover:border-brand-olive/30'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-brand-olive focus:ring-brand-olive border-gray-300" />
                    <span className="font-bold text-brand-dark text-lg">Cash on Delivery</span>
                  </div>
                  {paymentMethod === 'COD' && <CheckCircle2 className="text-brand-olive" size={20} />}
                </label>

                <label className={`relative flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'Online' ? 'border-brand-olive bg-brand-olive/5' : 'border-gray-200 hover:border-brand-olive/30'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="Online" checked={paymentMethod === 'Online'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-brand-olive focus:ring-brand-olive border-gray-300" />
                    <span className="font-bold text-brand-dark text-lg">Online Payment</span>
                  </div>
                  {paymentMethod === 'Online' && <CheckCircle2 className="text-brand-olive" size={20} />}
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-black text-brand-dark mb-6">3. Order Summary</h2>
              
              {/* Item List (Scrollable if many) */}
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.product._id} className="flex gap-4 items-center">
                    <img src={item.product.images?.[0]} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100 border border-gray-200" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-brand-dark truncate">{item.product.name}</p>
                      <p className="text-xs text-brand-dark/60 font-medium mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-black text-sm text-brand-dark">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* 4. Price Details */}
              <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider mb-4 mt-6">4. Price Details</h3>
              <div className="space-y-3 text-brand-dark/70 font-medium text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-brand-dark font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-4">
                  <span>Delivery Charges</span>
                  <span className="text-brand-dark font-bold">{shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE'}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-bold text-brand-dark text-lg">Amount Payable</span>
                  <span className="font-black text-brand-olive text-2xl">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* 5. Place Order Button */}
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full mt-8 bg-brand-orange text-white py-4 rounded-2xl font-bold text-lg hover:bg-brand-dark transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand-orange/20"
              >
                {isProcessing ? (
                  <><Loader2 size={20} className="animate-spin" /> Processing...</>
                ) : (
                  <>Place Order</>
                )}
              </button>
              
              <p className="text-xs text-center text-brand-dark/50 mt-4 font-medium flex items-center justify-center gap-1">
                By placing this order, you agree to our Terms & Conditions.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}