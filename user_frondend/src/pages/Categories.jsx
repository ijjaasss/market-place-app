// src/pages/Categories.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../store/categorySlice';
import { Search, ArrowRight, Loader2, Package, ImageIcon } from 'lucide-react';

export default function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items: categories, isLoading } = useSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch categories when the page loads
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

  return (
    <div className="min-h-screen bg-brand-light/20 pb-20 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-brand-dark">Categories</h1>
            <p className="text-brand-dark/70 mt-2">Find exactly what you're looking for</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 text-brand-dark px-4 py-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-olive/50 shadow-sm transition-all"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-brand-dark/40" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-brand-orange animate-spin" />
          </div>
        ) : (
          /* Categories Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div 
                  key={category._id} 
                  onClick={() => handleCategoryClick(category._id)}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border border-gray-100 cursor-pointer"
                >
                  {/* Category Image */}
                  <div className="h-56 bg-brand-light/30 relative overflow-hidden flex-shrink-0">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-olive/40 group-hover:text-brand-olive transition-colors">
                        <ImageIcon size={64} />
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-colors duration-300" />
                  </div>
                  
                  {/* Category Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-brand-dark mb-2">{category.name}</h3>
                    
                    {/* Product Count Indicator */}
                    <div className="flex items-center text-brand-dark/60 text-sm font-medium mb-6">
                      <Package size={16} className="mr-2 text-brand-olive" />
                      {/* Using fallback 'Multiple' since exact count might not be in the basic category API */}
                      <span>{category.productCount || 'Multiple'} Products</span>
                    </div>

                    {/* View Products Button */}
                    <button 
                      className="mt-auto flex items-center justify-between w-full py-3 px-5 rounded-xl border border-brand-olive text-brand-olive font-bold group-hover:bg-brand-olive group-hover:text-white transition-colors"
                    >
                      <span>View Products</span>
                      <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              /* Empty State for Search */
              <div className="col-span-full py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light/50 text-brand-dark/40 mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-2">No categories found</h3>
                <p className="text-brand-dark/60">We couldn't find anything matching "{searchTerm}".</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}