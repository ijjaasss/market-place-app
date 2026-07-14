import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserPlus, ShoppingBag, Search, Eye } from 'lucide-react';
import { fetchCustomers } from '../redux/slices/customerSlice';

const Customers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customers, cards, pagination, isLoading } = useSelector((state) => state.customers);

  const [queryParams, setQueryParams] = useState({
    page: 1, limit: 10, search: '', sort: '', filter: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchCustomers(queryParams));
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and view your customer base.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Customers" value={cards.totalCustomers} icon={Users} color="bg-[#8E76FF]" />
        <StatCard title="Active Customers" value={cards.activeCustomers} icon={UserCheck} color="bg-emerald-500" />
        <StatCard title="New (30 Days)" value={cards.newCustomers} icon={UserPlus} color="bg-blue-500" />
        <StatCard title="Total Orders" value={cards.totalOrders} icon={ShoppingBag} color="bg-amber-500" />
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text" name="search" value={queryParams.search} onChange={handleFilterChange}
            placeholder="Search name, email, or phone..."
            className="w-full pl-10 pr-3 py-2 bg-[#F3F3FF] border-none rounded-xl focus:ring-2 focus:ring-[#8E76FF] text-sm outline-none"
          />
        </div>
        
        <div className="flex gap-3">
          <select name="sort" value={queryParams.sort} onChange={handleFilterChange} className="bg-[#F3F3FF] border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#8E76FF] outline-none cursor-pointer">
            <option value="">Newest</option>
            <option value="most-orders">Most Orders</option>
            <option value="highest-spending">Highest Spending</option>
            <option value="oldest">Oldest</option>
          </select>
          <select name="filter" value={queryParams.filter} onChange={handleFilterChange} className="bg-[#F3F3FF] border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#8E76FF] outline-none cursor-pointer">
            <option value="">All Customers</option>
            <option value="repeat">Repeat Customers</option>
            <option value="high-spending">High Spenders (10k+)</option>
            <option value="new">New (30 Days)</option>
          </select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Orders</th>
                <th className="px-6 py-4 font-medium">Total Spent</th>
                <th className="px-6 py-4 font-medium">Joined / Last Order</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">Loading customers...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No customers found.</td></tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{customer.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{customer.email}</p>
                      <p className="text-xs text-gray-500">{customer.phone}</p>
                    </td>
                    <td className="px-6 py-4 font-medium">{customer.orderCount}</td>
                    <td className="px-6 py-4 font-bold text-[#8E76FF]">
                      ₹{customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 text-xs">Joined: {new Date(customer.joinedDate).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Last: {new Date(customer.lastOrder).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/customers/${customer._id}`)}
                        className="p-2 text-gray-400 hover:text-[#8E76FF] hover:bg-[#E0E0FB] rounded-lg transition-colors inline-flex"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
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
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-opacity-10 ${color.replace('bg-', 'bg-').replace('500', '100')} ${color.replace('bg-', 'text-')}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Customers;