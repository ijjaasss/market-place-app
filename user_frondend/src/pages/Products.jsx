// src/pages/Products.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProductsByCategory, fetchProducts } from '../store/productSlice';
import { 
  Loader2, 
  Search, 
  Grid3x3, 
  LayoutGrid,
  Sparkles,
  ShoppingBag,
  ArrowUpDown,
  Tag,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Flame
} from 'lucide-react';
import ProductCard from "../components/ProductCard";

export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract query parameters from URL
  const categoryId = searchParams.get('category');
  const page = parseInt(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'newest';
  const currentSearch = searchParams.get('search') || '';

  // Local state
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [viewMode, setViewMode] = useState('grid');

  const { items, pagination, isListLoading } = useSelector((state) => state.products);

  useEffect(() => {
    setSearchInput(currentSearch);

    const params = { page, sort, limit: 12 };
    if (currentSearch) params.search = currentSearch;

    if (categoryId) {
      dispatch(fetchProductsByCategory({ categoryId, params }));
    } else {
      dispatch(fetchProducts(params));
    }
  }, [dispatch, categoryId, page, sort, currentSearch]);

  // --- Event Handlers ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    
    params.set('page', '1');
    navigate(`/products?${params.toString()}`);
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    params.set('page', '1');
    navigate(`/products?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    navigate(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (categoryId) params.set('category', categoryId);
    navigate(`/products?${params.toString()}`);
    setSearchInput('');
  };

  // Get sort icon
  const getSortIcon = (value) => {
    const icons = {
      'newest': <Sparkles className="h-4 w-4" />,
      'oldest': <Clock className="h-4 w-4" />,
      'price-low': <TrendingUp className="h-4 w-4" />,
      'price-high': <TrendingUp className="h-4 w-4 rotate-180" />,
      'name-asc': <Flame className="h-4 w-4" />
    };
    return icons[value] || <ArrowUpDown className="h-4 w-4" />;
  };

  // --- Render ---
  if (isListLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light/30 via-white to-brand-light/20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full border-4 border-brand-orange/20 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-brand-orange border-t-transparent animate-spin"></div>
            </div>
          </div>
          <p className="text-brand-dark/60 font-medium mt-6 animate-pulse">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/30 via-white to-brand-light/20">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand-olive/90">
          <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] bg-brand-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-40%] left-[-10%] w-[600px] h-[600px] bg-brand-olive/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-3xl"></div>
          
          {/* Decorative Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20 mb-6 hover:bg-white/20 transition-all duration-300">
              <Sparkles className="h-4 w-4 text-brand-orange animate-pulse" />
              <span className="text-white/90 text-sm font-medium tracking-wide">
                {categoryId ? '🎯 Category Collection' : '✨ Our Premium Collection'}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 leading-tight">
              {categoryId ? (
                <>Explore <span className="text-brand-orange bg-clip-text">Category</span></>
              ) : (
                <>All <span className="text-brand-orange">Products</span></>
              )}
            </h1>
            
            {/* Subtitle */}
            {currentSearch ? (
              <p className="text-brand-light/80 text-lg md:text-xl">
                Showing results for <span className="text-brand-orange font-bold bg-white/10 px-3 py-1 rounded-full">“{currentSearch}”</span>
              </p>
            ) : (
              <p className="text-brand-light/80 text-lg md:text-xl max-w-2xl mx-auto">
                Discover our curated collection of premium products designed to elevate your lifestyle
              </p>
            )}
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="flex items-center gap-2 text-brand-light/70 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <ShoppingBag className="h-5 w-5 text-brand-orange" />
                <span className="font-medium">{pagination.totalItems || 0} Products</span>
              </div>
              {categoryId && (
                <div className="flex items-center gap-2 text-brand-light/70 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                  <Tag className="h-5 w-5 text-brand-olive" />
                  <span className="font-medium">Category Filtered</span>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="mt-10 max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange/30 to-brand-olive/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 group-hover:border-white/40 transition-all duration-300 focus-within:border-brand-orange shadow-2xl">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-light/50 group-focus-within:text-brand-orange transition-colors duration-300" />
                  <input
                    type="text"
                    placeholder="Search products by name, brand, or category..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-transparent text-white placeholder:text-brand-light/50 pl-14 pr-14 py-4.5 rounded-2xl focus:outline-none text-lg font-medium"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-light/50 hover:text-white transition-colors duration-300 bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-orange text-white px-6 py-2 rounded-xl font-semibold hover:bg-brand-orange/90 transition-all duration-300 shadow-lg shadow-brand-orange/30 hover:shadow-brand-orange/50 opacity-0 group-focus-within:opacity-100">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50 hover:shadow-3xl transition-shadow duration-500">
          
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-gray-100/80">
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100/50 rounded-2xl p-1.5 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30 scale-105' 
                      : 'text-brand-dark/50 hover:text-brand-dark hover:bg-white/50'
                  }`}
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30 scale-105' 
                      : 'text-brand-dark/50 hover:text-brand-dark hover:bg-white/50'
                  }`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
              </div>

              {/* Results count */}
              <div className="hidden sm:block">
                <span className="text-brand-dark/60 text-sm font-medium bg-gray-100/50 px-4 py-2 rounded-full">
                  Showing <span className="text-brand-dark font-bold">{items.length}</span> of{' '}
                  <span className="text-brand-dark font-bold">{pagination.totalItems || 0}</span> items
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative group">
                <select 
                  onChange={handleSortChange} 
                  value={sort} 
                  className="appearance-none bg-gray-100/50 text-brand-dark pl-5 pr-12 py-2.5 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange cursor-pointer hover:bg-gray-200/50 transition-all duration-300"
                >
                  <option value="newest">✨ Newest First</option>
                  <option value="oldest">📅 Oldest First</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💰 Price: High to Low</option>
                  <option value="name-asc">📝 Name: A-Z</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-dark/40 group-hover:text-brand-orange transition-colors duration-300">
                  {getSortIcon(sort)}
                </div>
              </div>

              {/* Mobile Results Count */}
              <span className="sm:hidden text-brand-dark/60 text-sm font-medium">
                {items.length}/{pagination.totalItems || 0}
              </span>
            </div>
          </div>

          {/* Product Grid/List */}
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-brand-light/40 to-brand-light/10 mb-8">
                <ShoppingBag size={48} className="text-brand-dark/30" />
              </div>
              <h2 className="text-3xl font-bold text-brand-dark mb-4">No products found</h2>
              <p className="text-brand-dark/60 max-w-md mx-auto text-lg">
                We couldn't find anything matching your current search. Try adjusting your search term.
              </p>
              <button 
                onClick={clearFilters}
                className="mt-8 px-10 py-4 bg-gradient-to-r from-brand-orange to-brand-orange/90 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-brand-orange/30 transition-all duration-300 transform hover:scale-105"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className={`grid ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            } gap-6 md:gap-8`}>
              {items.map((product, index) => (
                <div key={product._id} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                  <ProductCard product={product} viewMode={viewMode} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t-2 border-gray-100/80">
              <p className="text-brand-dark/60 text-sm font-medium bg-gray-100/50 px-5 py-2.5 rounded-full">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} -{' '}
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{' '}
                {pagination.totalItems} products
              </p>
              
              <div className="flex items-center gap-2">
                <button 
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-100/50 text-brand-dark rounded-2xl font-semibold hover:bg-brand-olive hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-100/50 disabled:hover:text-brand-dark group"
                >
                  <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1.5 px-3">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-11 h-11 rounded-2xl font-semibold transition-all duration-300 ${
                          page === pageNum
                            ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30 scale-110'
                            : 'text-brand-dark/70 hover:bg-gray-100/50 hover:scale-105'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  disabled={page >= pagination.totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-100/50 text-brand-dark rounded-2xl font-semibold hover:bg-brand-olive hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-100/50 disabled:hover:text-brand-dark group"
                >
                  Next
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

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
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}