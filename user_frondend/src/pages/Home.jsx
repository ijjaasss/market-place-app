// src/pages/Home.jsx
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../store/categorySlice';
import { fetchProducts } from '../store/productSlice';
import { 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Headphones, 
  CreditCard,
  Loader2,
  Sparkles,
  Star,
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  
  const { items: categories, isLoading: loadingCategories } = useSelector((state) => state.categories);
  const { items: latestProducts, isListLoading: loadingProducts } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ sort: 'newest', limit: 8 }));
  }, [dispatch]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  // Featured categories (first 6)
  const featuredCategories = categories.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light/30 to-white pb-20">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand-olive/90">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-orange/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] bg-brand-olive/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Sparkles className="h-4 w-4 text-brand-orange" />
                <span className="text-white/90 text-sm font-medium">New Collection 2026</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="text-white">Discover Premium</span>
                <br />
                <span className="text-brand-orange">Marketplace</span>
                <span className="text-white"> Experience</span>
              </h1>
              
              <p className="text-brand-light/80 text-lg max-w-lg leading-relaxed">
                Explore thousands of products from trusted sellers. Quality guaranteed, 
                delivered with care to your doorstep.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/products')}
                  className="group bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-brand-orange/30 hover:shadow-brand-orange/50 transition-all flex items-center gap-2"
                >
                  Start Shopping
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/categories')}
                  className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold border border-white/20 transition-all flex items-center gap-2"
                >
                  Browse Categories
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-black text-white">50K+</div>
                  <div className="text-brand-light/70 text-sm">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white">10K+</div>
                  <div className="text-brand-light/70 text-sm">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white">4.9★</div>
                  <div className="text-brand-light/70 text-sm">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image/Illustration */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-md">
                <div className="aspect-square bg-gradient-to-br from-brand-orange/20 to-brand-olive/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10 shadow-2xl">
                  <div className="w-full h-full rounded-2xl bg-white/5 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <ShoppingBag className="h-32 w-32 text-brand-orange/60 mx-auto" />
                      <div className="space-y-2">
                        <div className="h-3 bg-white/10 rounded-full w-48 mx-auto"></div>
                        <div className="h-3 bg-white/10 rounded-full w-32 mx-auto"></div>
                        <div className="flex justify-center gap-2 mt-4">
                          <div className="h-8 w-8 bg-brand-orange/30 rounded-full"></div>
                          <div className="h-8 w-8 bg-brand-olive/30 rounded-full"></div>
                          <div className="h-8 w-8 bg-white/20 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3 animate-bounce">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-brand-dark">4.9</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3 animate-bounce delay-1000">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-brand-orange" />
                    <span className="font-bold text-brand-dark text-sm">Free Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED CATEGORIES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="flex flex-wrap justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-brand-dark flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-brand-orange" />
                Featured Categories
              </h2>
              <p className="text-brand-dark/60 mt-1">Handpicked collections for you</p>
            </div>
            <button 
              onClick={() => navigate('/categories')}
              className="text-brand-orange font-semibold hover:gap-2 transition-all flex items-center gap-1"
            >
              View All <ArrowRight size={18} />
            </button>
          </div>

          {loadingCategories ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 text-brand-orange animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredCategories.map((category) => (
                <div 
                  key={category._id} 
                  onClick={() => handleCategoryClick(category._id)}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-light/30 to-white border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square flex items-center justify-center p-6">
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-light/20 rounded-xl flex items-center justify-center">
                          <ShoppingBag className="h-12 w-12 text-brand-olive/40" />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                      <span className="text-white font-bold text-sm">{category.name}</span>
                    </div>
                  </div>
                  <p className="text-center mt-2 font-medium text-brand-dark/80 group-hover:text-brand-orange transition-colors text-sm">
                    {category.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== LATEST PRODUCTS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-wrap justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark flex items-center gap-3">
              <Clock className="h-8 w-8 text-brand-orange" />
              Latest Arrivals
            </h2>
            <p className="text-brand-dark/60 mt-2">Fresh products just added to our collection</p>
          </div>
          <button 
            onClick={() => navigate('/products')}
            className="group bg-brand-orange text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/40 transition-all flex items-center gap-2 mt-4 sm:mt-0"
          >
            View All Products
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loadingProducts ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-brand-orange animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ===== FEATURES/BENEFITS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-brand-orange/20">
            <div className="bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Truck className="h-8 w-8 text-brand-orange" />
            </div>
            <h3 className="text-brand-dark font-bold text-lg mb-2">Free Delivery</h3>
            <p className="text-brand-dark/60 text-sm leading-relaxed">Enjoy free shipping on all orders over $50</p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-brand-orange/20">
            <div className="bg-gradient-to-br from-brand-olive/10 to-brand-olive/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-8 w-8 text-brand-olive" />
            </div>
            <h3 className="text-brand-dark font-bold text-lg mb-2">Secure Payment</h3>
            <p className="text-brand-dark/60 text-sm leading-relaxed">100% secure transactions with encryption</p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-brand-orange/20">
            <div className="bg-gradient-to-br from-brand-light to-brand-light/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Headphones className="h-8 w-8 text-brand-dark" />
            </div>
            <h3 className="text-brand-dark font-bold text-lg mb-2">24/7 Support</h3>
            <p className="text-brand-dark/60 text-sm leading-relaxed">Dedicated team ready to assist you anytime</p>
          </div>

          {/* Feature 4 */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-brand-orange/20">
            <div className="bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <CreditCard className="h-8 w-8 text-brand-orange" />
            </div>
            <h3 className="text-brand-dark font-bold text-lg mb-2">Easy Returns</h3>
            <p className="text-brand-dark/60 text-sm leading-relaxed">30-day hassle-free return policy</p>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER / CTA ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand-olive/90 p-10 md:p-16">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-olive/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <Sparkles className="h-12 w-12 text-brand-orange mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-brand-light/80 text-lg mb-8">
              Join thousands of happy customers. Discover amazing products at unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/products')}
                className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-brand-orange/30 transition-all"
              >
                Browse Products
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold border border-white/20 transition-all"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}