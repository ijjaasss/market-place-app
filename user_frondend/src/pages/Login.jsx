// src/pages/Login.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../store/authSlice';
import { Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(resultAction)) {
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
            <h1 className="text-2xl font-bold text-brand-orange">Logo Here</h1>
          </div>

          <div className="max-w-md w-full mx-auto mt-12 lg:mt-0">
            <p className="text-brand-dark/70 mb-2 font-medium">Welcome back !!!</p>
            <h2 className="text-4xl sm:text-5xl font-black text-brand-dark mb-10">Log In</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-dark">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="login@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#E8E7ED] px-4 py-3.5 rounded-xl text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-brand-dark">Password</label>
                  <a href="#" className="text-xs text-brand-dark/60 hover:text-brand-orange transition-colors">Forgot Password ?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#E8E7ED] pl-4 pr-12 py-3.5 rounded-xl text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-orange/70 hover:text-brand-orange transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-brand-orange text-white px-10 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg shadow-brand-orange/30 mx-auto lg:mx-0"
                >
                  {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </div>
            </form>

            {/* Social Logins */}


            <p className="text-center mt-10 text-sm text-brand-dark/70">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-brand-orange font-semibold hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Image/Illustration */}
        <div className="hidden lg:block w-1/2 p-4">
          <div className="w-full h-full rounded-[2rem] bg-brand-olive overflow-hidden relative shadow-inner">
            <img 
              src="https://st3.depositphotos.com/5411610/15334/i/450/depositphotos_153344150-stock-photo-small-empty-shopping-cart.jpg" 
              alt="Cinematic presentation" 
              className="w-full h-full object-cover opacity-90 mix-blend-overlay"
            />
          </div>
        </div>

      </div>
    </div>
  );
}