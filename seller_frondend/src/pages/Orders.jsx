import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Clock, CheckCircle, Truck, Package, XCircle, 
  Search, Eye 
} from 'lucide-react';
import { fetchOrders } from '../redux/slices/orderSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, cards, pagination, isLoading } = useSelector((state) => state.orders);

  const [queryParams, setQueryParams] = useState({
    page: 1, limit: 10, search: '', status: '', payment: '', sort: 'newest'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchOrders(queryParams));
    }, 300);
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
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and track your customer orders.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total" value={cards.totalOrders} icon={ShoppingBag} color="bg-gray-500" />
        <StatCard title="Pending" value={cards.pendingOrders} icon={Clock} color="bg-amber-500" />
        <StatCard title="Confirmed" value={cards.confirmedOrders} icon={CheckCircle} color="bg-blue-500" />
        <StatCard title="Shipped" value={cards.shippedOrders} icon={Truck} color="bg-[#8E76FF]" />
        <StatCard title="Delivered" value={cards.deliveredOrders} icon={Package} color="bg-emerald-500" />
        <StatCard title="Cancelled" value={cards.cancelledOrders} icon={XCircle} color="bg-rose-500" />
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text" name="search" value={queryParams.search} onChange={handleFilterChange}
            placeholder="Search Customer or City..."
            className="w-full pl-10 pr-3 py-2 bg-[#F3F3FF] border-none rounded-xl focus:ring-2 focus:ring-[#8E76FF] text-sm outline-none"
          />
        </div>
        
        <div className="flex flex-wrap w-full lg:w-auto gap-3">
          <select name="status" value={queryParams.status} onChange={handleFilterChange} className="bg-[#F3F3FF] border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#8E76FF] outline-none">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select name="payment" value={queryParams.payment} onChange={handleFilterChange} className="bg-[#F3F3FF] border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#8E76FF] outline-none">
            <option value="">All Payments</option>
            <option value="COD">COD</option>
            <option value="Online">Online</option>
          </select>
          <select name="sort" value={queryParams.sort} onChange={handleFilterChange} className="bg-[#F3F3FF] border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#8E76FF] outline-none">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID / Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Total Amount</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No orders found.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 truncate w-24 sm:w-auto">#{order._id.substring(0, 8)}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{order.shippingAddress?.fullName}</p>
                      <p className="text-xs text-gray-500">{order.shippingAddress?.city}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/orders/${order._id}`)}
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

export const OrderStatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-100 text-amber-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Packed: 'bg-indigo-100 text-indigo-700',
    Shipped: 'bg-[#E0E0FB] text-[#8E76FF]',
    Delivered: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-rose-100 text-rose-700',
  }[status] || 'bg-gray-100 text-gray-700';

  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles}`}>{status}</span>;
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center text-center">
    <div className={`p-2 rounded-lg bg-opacity-10 mb-2 ${color.replace('bg-', 'bg-').replace('500', '100')} ${color.replace('bg-', 'text-')}`}>
      <Icon className="w-5 h-5" />
    </div>
    <p className="text-xl font-bold text-gray-900">{value}</p>
    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
  </div>
);

export default Orders;