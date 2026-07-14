// src/pages/Home.jsx
import { useEffect } from 'react';
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
  Loader2
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Extract state from Redux slices
  const { items: categories, isLoading: loadingCategories } = useSelector((state) => state.categories);
  const { items: latestProducts, isListLoading: loadingProducts } = useSelector((state) => state.products);

  // Fetch data on component mount via Redux actions
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ sort: 'newest', limit: 8 }));
  }, [dispatch]);

  const handleCategoryClick = (categoryId) => {
    // Navigate to products page with category query parameter for pagination handling
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-brand-light/20 pb-20">
      
      {/* 1. Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-brand-dark">Shop by Category</h2>
            <p className="text-brand-dark/70 mt-2">Explore our wide range of collections</p>
          </div>
        </div>

        {loadingCategories ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 text-brand-orange animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <div 
                key={category._id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border border-gray-100"
              >
                {/* Category Image */}
                <div className="h-40 bg-brand-light/40 relative overflow-hidden flex-shrink-0">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-olive/50">
                      <ShoppingBag size={40} />
                    </div>
                  )}
                </div>
                
                {/* Category Content */}
                <div className="p-4 flex flex-col flex-grow justify-between text-center">
                  <h3 className="font-bold text-brand-dark mb-4">{category.name}</h3>
                  <button 
                    onClick={() => handleCategoryClick(category._id)}
                    className="w-full py-2 px-4 rounded-xl border-2 border-brand-olive text-brand-olive font-semibold hover:bg-brand-olive hover:text-white transition-colors text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. Latest Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-brand-dark">Latest Arrivals</h2>
            <p className="text-brand-dark/70 mt-2">Check out our newest products</p>
          </div>
          <button 
            onClick={() => navigate('/products')}
            className="hidden sm:flex items-center text-brand-orange font-bold hover:gap-2 transition-all gap-1"
          >
            View All <ArrowRight size={20} />
          </button>
        </div>

        {loadingProducts ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 text-brand-orange animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestProducts.map((product) => (
              <ProductCard product={product}/>
            ))}
          </div>
        )}
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="bg-brand-olive rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white">Why Choose Us?</h2>
            <p className="text-brand-light mt-4 max-w-2xl mx-auto">
              We are dedicated to providing you with the best shopping experience possible, from secure checkouts to lightning-fast deliveries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {/* Feature 1 */}
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 text-center hover:bg-white/20 transition-colors">
              <div className="bg-brand-orange w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                <Truck size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Fast Delivery</h3>
              <p className="text-brand-light/80 text-sm">Nationwide shipping ensuring your products arrive on time.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 text-center hover:bg-white/20 transition-colors">
              <div className="bg-brand-orange w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Secure Payments</h3>
              <p className="text-brand-light/80 text-sm">100% secure payment gateways to protect your transactions.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 text-center hover:bg-white/20 transition-colors">
              <div className="bg-brand-orange w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                <Headphones size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">24/7 Support</h3>
              <p className="text-brand-light/80 text-sm">Our dedicated customer service team is always here to help.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 text-center hover:bg-white/20 transition-colors">
              <div className="bg-brand-orange w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                <CreditCard size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Easy Returns</h3>
              <p className="text-brand-light/80 text-sm">Hassle-free 30-day return policy for your peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}