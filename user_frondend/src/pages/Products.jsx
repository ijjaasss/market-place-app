// src/pages/Products.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProductsByCategory, fetchProducts } from '../store/productSlice';
import { Loader2, Search } from 'lucide-react';
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

  // Local state for the search input field
  const [searchInput, setSearchInput] = useState(currentSearch);

  const { items, pagination, isListLoading } = useSelector((state) => state.products);

  useEffect(() => {
    // Keep local search input in sync if the URL changes externally (e.g., hitting back button)
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
      params.delete('search'); // Remove param if search is cleared
    }
    
    params.set('page', '1'); // Always reset to page 1 on a new search
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

  // --- Render ---

  if (isListLoading) {
    return (
      <div className="py-20 flex justify-center min-h-[50vh] items-center">
        <Loader2 className="animate-spin h-10 w-10 text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      
      {/* Header, Search, and Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark">
            {categoryId ? 'Category Products' : 'All Products'}
          </h1>
          {currentSearch && (
            <p className="text-brand-dark/60 mt-1">
              Showing results for <span className="font-bold text-brand-orange">"{currentSearch}"</span>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Bar Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search products or brands..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full border border-gray-200 py-2.5 pl-10 pr-4 rounded-xl bg-white text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-olive shadow-sm transition-all"
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-brand-dark/40" />
            
            {/* Optional visually hidden submit button to allow 'Enter' key submission */}
            <button type="submit" className="sr-only">Search</button>
          </form>

          {/* Sort Dropdown */}
          <select 
            onChange={handleSortChange} 
            value={sort} 
            className="border border-gray-200 p-2.5 rounded-xl bg-white text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-olive shadow-sm cursor-pointer w-full sm:w-auto"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {items.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light/50 text-brand-dark/40 mb-4">
            <Search size={32} />
          </div>
          <h2 className="text-2xl font-bold text-brand-dark mb-2">No products found</h2>
          <p className="text-brand-dark/60 max-w-md mx-auto">
            We couldn't find anything matching your current filters. Try adjusting your search term or clearing filters.
          </p>
          <button 
            onClick={() => navigate(categoryId ? `/products?category=${categoryId}` : '/products')}
            className="mt-6 px-6 py-2 bg-brand-olive text-white font-bold rounded-xl hover:bg-brand-dark transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-6">
          <button 
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            className="px-6 py-2.5 bg-brand-light text-brand-dark rounded-xl font-bold hover:bg-brand-olive hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="font-medium text-brand-dark/80">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button 
            disabled={page >= pagination.totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="px-6 py-2.5 bg-brand-light text-brand-dark rounded-xl font-bold hover:bg-brand-olive hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}