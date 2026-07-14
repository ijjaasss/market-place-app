// src/pages/Register.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../store/authSlice';
import { Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/'); 
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 lg:p-8">
      <div className="bg-white w-full max-w-6xl rounded-[2rem] shadow-2xl flex overflow-hidden min-h-[650px]">
        
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center relative">
          
          {/* Logo Placeholder */}
          <div className="absolute top-8 left-8 sm:left-12 md:left-16">
            <h1 className="text-2xl font-bold text-brand-olive">Logo Here</h1>
          </div>

          <div className="max-w-md w-full mx-auto mt-12 lg:mt-0">
            <p className="text-brand-dark/70 mb-2 font-medium">Join our marketplace</p>
            <h2 className="text-4xl sm:text-5xl font-black text-brand-dark mb-10">Sign Up</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-dark">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#E8E7ED] px-4 py-3 rounded-xl text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:ring-2 focus:ring-brand-olive/50 transition-all"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-dark">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#E8E7ED] px-4 py-3 rounded-xl text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:ring-2 focus:ring-brand-olive/50 transition-all"
                />
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-dark">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#E8E7ED] px-4 py-3 rounded-xl text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:ring-2 focus:ring-brand-olive/50 transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-dark">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#E8E7ED] pl-4 pr-12 py-3 rounded-xl text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:ring-2 focus:ring-brand-olive/50 transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-olive/70 hover:text-brand-olive transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-brand-olive text-white px-10 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg shadow-brand-olive/30 mx-auto lg:mx-0"
                >
                  {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {isLoading ? 'CREATING...' : 'REGISTER'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </div>
            </form>

            <p className="text-center mt-8 text-sm text-brand-dark/70">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-olive font-semibold hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Image/Illustration */}
        <div className="hidden lg:block w-1/2 p-4">
          <div className="w-full h-full rounded-[2rem] bg-brand-dark overflow-hidden relative shadow-inner">
            <img 
              src="https://st3.depositphotos.com/5411610/15334/i/450/depositphotos_153344150-stock-photo-small-empty-shopping-cart.jpg" 
              alt="Cinematic setup" 
              className="w-full h-full object-cover opacity-70 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
            />
          </div>
        </div>

      </div>
    </div>
  );
}