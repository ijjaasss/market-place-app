import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn } from 'lucide-react';
import { loginSeller } from '../redux/slices/authSlice';



const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isAuthenticated, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.warning('Please fill in all fields');
    }

    const resultAction = await dispatch(loginSeller(formData));

    if (loginSeller.fulfilled.match(resultAction)) {
      toast.success('Login successful!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#E0E0FB] flex items-center justify-center p-8">
      {/* Decorative floating blurred background elements inspired by image_0.png */}
      <div className="absolute top-20 left-1/4 w-32 h-32 bg-[#8E76FF] rounded-full blur-[100px] opacity-20"></div>
      <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-white rounded-full blur-[100px] opacity-30"></div>

      {/* Main card with split-screen design from image_0.png */}
      <div className="flex max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 transition-all duration-300">
        
        {/* Left Side (White Form section) */}
        <div className="flex-1 p-16 flex flex-col justify-between">
          <div>
            <div className="mb-12">
              <h1 className="text-5xl font-extrabold text-gray-900 mb-2">Seller Portal</h1>
              <p className="text-gray-500 text-base">Sign in to manage your shop, inspired by the reference.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3 bg-[#F3F3FF] border border-[#F3F3FF] rounded-xl focus:ring-2 focus:ring-[#8E76FF] focus:border-[#8E76FF] outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="seller@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3 bg-[#F3F3FF] border border-[#F3F3FF] rounded-xl focus:ring-2 focus:ring-[#8E76FF] focus:border-[#8E76FF] outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-sm text-[#8E76FF] hover:text-[#7C63F5] font-medium transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 bg-[#8E76FF] hover:bg-[#7C63F5] text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:bg-[#A8A0FB]"
              >
                {isLoading ? (
                  <span className="animate-pulse">Signing in...</span>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Login Now
                  </>
                )}
              </button>
            </form>

          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have a seller account?{' '}
            <Link to="/register" className="font-semibold text-[#8E76FF] hover:text-[#7C63F5] transition-colors">
              Register here
            </Link>
          </div>
        </div>


        <div className="flex-1 bg-[#8E76FF] p-16 relative overflow-hidden flex flex-col justify-center items-center text-white text-center">
          

          <div className="absolute inset-0 opacity-10 bg-[url('bg-purple-pattern.png')] bg-cover bg-center"></div>

          <div className="absolute -top-10 -right-20 w-80 h-80 bg-[#E0E0FB] rounded-full opacity-20 blur-[100px]"></div>

   
          <div className="bg-white/10 border border-white/20 p-6 rounded-3xl backdrop-blur-sm relative z-20 mb-8 max-w-sm">
            <img 
              src="https://img.pikbest.com/element_our/20221120/bg/a9fe136a2c547.png!w700wp" 
              alt="Smiling Seller" 
              className="w-full rounded-2xl object-cover h-[350px] shadow-lg"
            />
          </div>

          <div className="relative z-20">
              <h3 className="text-3xl font-extrabold mb-3">Join Our Growing Community</h3>
              <p className="text-white/80 text-lg">Access powerful tools to manage your shop and reach new customers.</p>
          </div>
          
          {/* Small yellow accent icon from image_0.png bottom right */}
          <div className="absolute bottom-10 right-10 bg-white p-3 rounded-full shadow-lg z-30">
              <div className="w-8 h-8 bg-[#FCD34D] rounded-full flex items-center justify-center text-white">
                  <Lock className='h-5 w-5 text-white' />
              </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;

