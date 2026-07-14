import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, User, MapPin, Package, ShoppingCart, Calendar } from 'lucide-react';
import { fetchCustomerDetails, clearCurrentCustomer } from '../redux/slices/customerSlice';
import { OrderStatusBadge } from './Orders'; // Reusing your existing badge component

const CustomerDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentCustomer: data, isDetailsLoading } = useSelector((state) => state.customers);

  useEffect(() => {
    dispatch(fetchCustomerDetails(id));
    return () => dispatch(clearCurrentCustomer());
  }, [dispatch, id]);

  if (isDetailsLoading || !data) {
    return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8E76FF]"></div></div>;
  }

  const { customer, statistics, orders, products, shippingAddresses } = data;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-sm text-gray-500">Customer ID: {customer._id}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={statistics.totalOrders} icon={ShoppingCart} color="text-blue-500 bg-blue-100" />
        <StatCard title="Products Bought" value={statistics.totalProductsPurchased} icon={Package} color="text-amber-500 bg-amber-100" />
        <StatCard title="Total Spent" value={`₹${statistics.totalSpent.toLocaleString()}`} icon={User} color="text-emerald-500 bg-emerald-100" />
        <StatCard 
          title="Last Order Date" 
          value={new Date(statistics.lastOrderDate).toLocaleDateString()} 
          icon={Calendar} 
          color="text-[#8E76FF] bg-[#E0E0FB]" 
          isDate
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Customer Info & Addresses) */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4 border-b pb-2">Customer Information</h2>
            <div className="space-y-3 text-sm">
              <div><p className="text-gray-500">Name</p><p className="font-medium text-gray-900">{customer.name}</p></div>
              <div><p className="text-gray-500">Email</p><p className="font-medium text-gray-900">{customer.email}</p></div>
              <div><p className="text-gray-500">Phone</p><p className="font-medium text-gray-900">{customer.phone}</p></div>
              <div><p className="text-gray-500">Joined</p><p className="font-medium text-gray-900">{new Date(customer.joinedDate).toLocaleDateString()}</p></div>
            </div>
          </div>

          {/* Shipping Addresses */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <h2 className="font-bold text-gray-900">Shipping Addresses</h2>
            </div>
            <div className="space-y-4">
              {shippingAddresses.length === 0 ? (
                <p className="text-sm text-gray-500">No addresses found.</p>
              ) : (
                shippingAddresses.map((addr, idx) => (
                  <div key={idx} className="text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="font-medium text-gray-900">{addr.fullName}</p>
                    <p className="text-gray-600 mt-1">{addr.address}</p>
                    <p className="text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-gray-500 mt-1">{addr.phone}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Orders & Products) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Orders from You</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">Order ID</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">#{order._id.substring(0, 8)}</td>
                      <td className="px-6 py-3">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="px-6 py-3 font-bold">₹{order.amount.toLocaleString()}</td>
                      <td className="px-6 py-3"><OrderStatusBadge status={order.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Purchased Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-bold text-gray-900">Purchased Products</h2>
            </div>
            <div className="p-5 space-y-4">
              {products.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <img 
                      src={prod.image || 'https://via.placeholder.com/60'} 
                      alt={prod.name} 
                      className="w-12 h-12 object-cover rounded-lg border border-gray-100" 
                    />
                    <p className="font-semibold text-gray-900">{prod.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{prod.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Qty: {prod.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, isDate }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-center">
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    </div>
    <p className={`${isDate ? 'text-lg' : 'text-2xl'} font-bold text-gray-900`}>{value}</p>
  </div>
);

export default CustomerDetails;