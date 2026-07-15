// src/pages/Categories.jsx
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../store/categorySlice';
import { 
  Search, 
  ArrowRight, 
  Loader2, 
  Package, 
  ImageIcon,
  Grid3x3,
  LayoutGrid,
  Sparkles,
  ChevronRight,
  Tag,
  ShoppingBag
} from 'lucide-react';

export default function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items: categories, isLoading } = useSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'compact'
  const searchInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Client-side filtering based on the search bar
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  // Get random gradient for category cards
  const getGradient = (index) => {
    const gradients = [
      'from-brand-orange/20 to-brand-orange/5',
      'from-brand-olive/20 to-brand-olive/5',
      'from-brand-light to-brand-light/50',
      'from-blue-200/30 to-blue-100/20',
      'from-purple-200/30 to-purple-100/20',
      'from-pink-200/30 to-pink-100/20',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light/30 to-white pb-20">
      
      {/* ===== HERO HEADER ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand-olive/90">
        <div className="absolute top-[-30%] right-[-10%] w-[400px] h-[400px] bg-brand-orange/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-40%] left-[-10%] w-[500px] h-[500px] bg-brand-olive/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <Sparkles className="h-4 w-4 text-brand-orange" />
              <span className="text-white/90 text-sm font-medium">Browse Our Collections</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              Explore <span className="text-brand-orange">Categories</span>
            </h1>
            
            <p className="text-brand-light/80 text-lg max-w-2xl mx-auto">
              Discover thousands of products organized in our carefully curated categories
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-colors group focus-within:border-brand-orange">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-light/60 group-focus-within:text-brand-orange transition-colors" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-white placeholder:text-brand-light/50 px-12 py-4 rounded-2xl focus:outline-none text-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-light/50 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* Category count */}
              {!isLoading && (
                <p className="text-brand-light/60 text-sm mt-3 text-center">
                  {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} available
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES GRID ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
          
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-brand-light/20 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30' 
                      : 'text-brand-dark/60 hover:text-brand-dark'
                  }`}
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'compact' 
                      ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30' 
                      : 'text-brand-dark/60 hover:text-brand-dark'
                  }`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
              </div>
              <span className="text-brand-dark/60 text-sm hidden sm:inline">
                {filteredCategories.length} categories
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-brand-dark/60 text-sm">
              <Tag className="h-4 w-4" />
              <span>Popular categories shown first</span>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-16 w-16 text-brand-orange animate-spin" />
              <p className="text-brand-dark/60 mt-4 font-medium">Loading categories...</p>
            </div>
          ) : (
            /* Categories Grid */
            <div className={`grid ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            } gap-6`}>
              
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <div 
                    key={category._id} 
                    onClick={() => handleCategoryClick(category._id)}
                    className={`group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100 hover:border-brand-orange/20 hover:-translate-y-1 ${
                      viewMode === 'compact' ? 'flex items-center p-4 gap-4' : 'flex flex-col'
                    }`}
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(index)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Image Container */}
                    <div className={`relative overflow-hidden ${
                      viewMode === 'compact' 
                        ? 'w-20 h-20 rounded-xl flex-shrink-0' 
                        : 'h-52'
                    }`}>
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className={`w-full h-full object-cover ${
                            viewMode === 'compact' ? 'rounded-xl' : ''
                          } group-hover:scale-110 transition-transform duration-700`}
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center bg-brand-light/20 ${
                          viewMode === 'compact' ? 'rounded-xl' : ''
                        }`}>
                          <ImageIcon className={`${
                            viewMode === 'compact' ? 'h-8 w-8' : 'h-16 w-16'
                          } text-brand-dark/30 group-hover:text-brand-orange transition-colors`} />
                        </div>
                      )}
                      
                      {/* Image Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent ${
                        viewMode === 'compact' ? 'opacity-0' : 'opacity-100'
                      }`}></div>
                      
                      {/* Category Name Overlay (Grid View) */}
                      {viewMode === 'grid' && (
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white text-xl font-bold drop-shadow-lg">
                            {category.name}
                          </h3>
                          <div className="flex items-center text-white/80 text-sm mt-1">
                            <Package size={14} className="mr-1" />
                            <span>{category.productCount || 'Multiple'} Products</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Content (Compact View) */}
                    {viewMode === 'compact' ? (
                      <div className="flex-1 min-w-0 relative z-10">
                        <h3 className="text-lg font-bold text-brand-dark group-hover:text-brand-orange transition-colors">
                          {category.name}
                        </h3>
                        <div className="flex items-center text-brand-dark/60 text-sm mt-1">
                          <Package size={14} className="mr-1" />
                          <span>{category.productCount || 'Multiple'} Products</span>
                        </div>
                        <div className="mt-3">
                          <span className="inline-flex items-center text-brand-orange font-semibold text-sm group-hover:gap-2 transition-all gap-1">
                            Browse
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* View Products Button (Grid View) */
                      <div className="p-4 relative z-10 bg-white">
                        <button 
                          className="w-full py-2.5 px-4 rounded-xl bg-brand-olive/10 text-brand-olive font-semibold hover:bg-brand-olive hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                        >
                          <span>View Products</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    )}
                    
                    {/* Decorative corner badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRight className="h-4 w-4 text-brand-orange" />
                    </div>
                  </div>
                ))
              ) : (
                /* Empty State for Search */
                <div className="col-span-full py-20 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-light/30 mb-6">
                    <Search size={40} className="text-brand-dark/30" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-3">No categories found</h3>
                  <p className="text-brand-dark/60 text-lg max-w-md mx-auto">
                    We couldn't find anything matching "<span className="text-brand-orange font-semibold">{searchTerm}</span>"
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-6 inline-flex items-center gap-2 text-brand-orange font-semibold hover:gap-3 transition-all"
                  >
                    Clear search
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bottom CTA */}
          {!isLoading && filteredCategories.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-brand-dark/60 mb-4">Can't find what you're looking for?</p>
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/40 transition-all hover:gap-3"
              >
                Browse All Products
                <ShoppingBag className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}