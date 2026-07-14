import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  Package, CheckCircle2, Clock, XCircle, Search, Filter, 
  Plus, Eye, Edit2, Trash2, X, UploadCloud, AlertCircle
} from 'lucide-react';
import { 
  fetchProducts, fetchCategories, addProduct, updateProduct, deleteProduct 
} from '../redux/slices/productSlice';

const Products = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  
  const { 
    products, cards, categories, pagination, isLoading, isActionLoading 
  } = useSelector((state) => state.products);

  const isApprovedSeller = user?.status === 'Approved';

  // State for Filters
  const [queryParams, setQueryParams] = useState({
    page: 1, limit: 10, search: '', status: '', sort: 'newest'
  });

  // Modal States
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products whenever query params change
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchProducts(queryParams));
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [queryParams, dispatch]);

  const handleFilterChange = (e) => {
    setQueryParams({ ...queryParams, [e.target.name]: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setQueryParams({ ...queryParams, page: newPage });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    const resultAction = await dispatch(deleteProduct(id));
    if (deleteProduct.fulfilled.match(resultAction)) {
      toast.success('Product deleted successfully');
      dispatch(fetchProducts(queryParams)); // Refresh list
    } else {
      toast.error(resultAction.payload);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Seller Status Warning */}
      {!isApprovedSeller && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-800 shadow-sm">
          <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-base text-amber-900">Action Restricted</h3>
            <p className="text-sm text-amber-700 mt-0.5">
              Your account is currently <strong>{user?.status}</strong>. You can view products, but adding, editing, or deleting products requires an <strong>Approved</strong> account status.
            </p>
          </div>
        </div>
      )}

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your inventory and track approval statuses.</p>
        </div>
        <button
          onClick={() => { setSelectedProduct(null); setShowAddEditModal(true); }}
          disabled={!isApprovedSeller}
          className="flex items-center gap-2 bg-[#8E76FF] hover:bg-[#7C63F5] text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={cards.totalProducts} icon={Package} color="bg-[#8E76FF]" />
        <StatCard title="Approved" value={cards.approvedProducts} icon={CheckCircle2} color="bg-emerald-500" />
        <StatCard title="Pending" value={cards.pendingProducts} icon={Clock} color="bg-amber-500" />
        <StatCard title="Rejected" value={cards.rejectedProducts} icon={XCircle} color="bg-rose-500" />
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text" name="search" value={queryParams.search} onChange={handleFilterChange}
            placeholder="Search products..."
            className="block w-full pl-10 pr-3 py-2 bg-[#F3F3FF] border-none rounded-xl focus:ring-2 focus:ring-[#8E76FF] text-sm outline-none"
          />
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <select name="status" value={queryParams.status} onChange={handleFilterChange} className="bg-[#F3F3FF] border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#8E76FF] outline-none">
            <option value="">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select name="sort" value={queryParams.sort} onChange={handleFilterChange} className="bg-[#F3F3FF] border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#8E76FF] outline-none">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Brand</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400">Loading products...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400">No products found.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={product.images[0] || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <span className="font-semibold text-gray-900 line-clamp-1 max-w-[150px]">{product.name}</span>
                    </td>
                    <td className="px-6 py-4">{product.category?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{product.brand || 'N/A'}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${product.stock <= 5 ? 'text-red-500' : 'text-gray-900'}`}>{product.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setSelectedProduct(product); setShowViewModal(true); }} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {isApprovedSeller && (
                          <>
                            <button onClick={() => { setSelectedProduct(product); setShowAddEditModal(true); }} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)} of {pagination.totalRecords} entries
          </div>
          <div className="flex gap-2">
            <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <span className="px-3 py-1 bg-[#F3F3FF] text-[#8E76FF] font-medium rounded-lg">{pagination.currentPage} / {pagination.totalPages}</span>
            <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages} className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {showViewModal && selectedProduct && (
        <ViewProductModal 
          product={selectedProduct} 
          onClose={() => setShowViewModal(false)} 
        />
      )}

      {showAddEditModal && (
        <AddEditProductModal 
          product={selectedProduct} 
          categories={categories}
          isLoading={isActionLoading}
          onClose={() => setShowAddEditModal(false)} 
          onSave={async (formData) => {
            const action = selectedProduct 
              ? updateProduct({ id: selectedProduct._id, formData }) 
              : addProduct(formData);
            
            const result = await dispatch(action);
            if (result.meta.requestStatus === 'fulfilled') {
              toast.success(`Product ${selectedProduct ? 'updated' : 'added'} successfully! Waiting for approval.`);
              setShowAddEditModal(false);
              dispatch(fetchProducts(queryParams));
            } else {
              toast.error(result.payload);
            }
          }}
        />
      )}

    </div>
  );
};

// --- Sub Components ---

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-opacity-10 text-opacity-100 flex items-center justify-center ${color.replace('bg-', 'bg-').replace('500', '100')} ${color.replace('bg-', 'text-')}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  }[status] || 'bg-gray-50 text-gray-700 border-gray-200';

  return <span className={`px-2.5 py-1 border rounded-full text-xs font-semibold ${styles}`}>{status}</span>;
};

// --- Modals ---

const ViewProductModal = ({ product, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
      <div className="sticky top-0 bg-white/80 backdrop-blur border-b border-gray-100 p-6 flex justify-between items-center z-10">
        <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
      </div>
      
      <div className="p-6 space-y-6">
        {product.status === 'Rejected' && product.rejectReason && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
            <strong>Rejection Reason:</strong> {product.rejectReason}
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2">
          {product.images?.map((img, idx) => (
            <img key={idx} src={img} alt="product" className="w-32 h-32 object-cover rounded-xl border border-gray-200 shrink-0" />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div><p className="text-sm text-gray-500">Name</p><p className="font-semibold text-gray-900">{product.name}</p></div>
          <div><p className="text-sm text-gray-500">Status</p><StatusBadge status={product.status} /></div>
          <div><p className="text-sm text-gray-500">Category</p><p className="font-semibold text-gray-900">{product.category?.name || 'N/A'}</p></div>
          <div><p className="text-sm text-gray-500">Brand</p><p className="font-semibold text-gray-900">{product.brand || 'N/A'}</p></div>
          <div><p className="text-sm text-gray-500">Price</p><p className="font-semibold text-gray-900">₹{product.price}</p></div>
          <div><p className="text-sm text-gray-500">Stock</p><p className="font-semibold text-gray-900">{product.stock} units</p></div>
          <div className="col-span-2"><p className="text-sm text-gray-500">Description</p><p className="text-gray-900 text-sm mt-1">{product.description}</p></div>
        </div>
      </div>
    </div>
  </div>
);

const AddEditProductModal = ({ product, categories, isLoading, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category?._id || '',
    brand: product?.brand || '',
    price: product?.price || '',
    stock: product?.stock || ''
  });
  const [files, setFiles] = useState([]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) return toast.warning('Maximum 5 images allowed');
    setFiles(selectedFiles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product && files.length === 0) return toast.warning('Please upload at least one image');
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    files.forEach(file => submitData.append('images', file));
    
    onSave(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="border-b border-gray-100 p-6 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#F3F3FF] rounded-xl outline-none focus:ring-2 focus:ring-[#8E76FF]" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#F3F3FF] rounded-xl outline-none focus:ring-2 focus:ring-[#8E76FF]">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#F3F3FF] rounded-xl outline-none focus:ring-2 focus:ring-[#8E76FF]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#F3F3FF] rounded-xl outline-none focus:ring-2 focus:ring-[#8E76FF]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#F3F3FF] rounded-xl outline-none focus:ring-2 focus:ring-[#8E76FF]" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#F3F3FF] rounded-xl outline-none focus:ring-2 focus:ring-[#8E76FF] resize-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Images (Max 5)</label>
              {product && <p className="text-xs text-amber-600 mb-2">Note: Uploading new images will replace existing ones.</p>}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#8E76FF]/50 rounded-xl cursor-pointer bg-[#F3F3FF] hover:bg-[#E0E0FB]/50 transition-colors">
                <UploadCloud className="w-8 h-8 text-[#8E76FF] mb-2" />
                <span className="text-sm text-gray-500">{files.length > 0 ? `${files.length} file(s) selected` : 'Click to browse images'}</span>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="bg-[#8E76FF] hover:bg-[#7C63F5] text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-70 flex items-center gap-2">
              {isLoading ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Products;