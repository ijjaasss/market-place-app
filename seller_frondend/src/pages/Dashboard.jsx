import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  IndianRupee, 
  ShoppingBag, 
  Package, 
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { fetchDashboardData } from '../redux/slices/dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8E76FF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    );
  }

  if (!data || !data.success) return null;

  const { cards, salesChart, orderChart, productChart, recentOrders } = data;
  const maxSales = Math.max(...salesChart.map(s => s.totalSales), 1);
console.log(user.status);

  return (
    <div className="space-y-6">
      
      {/* --- ADMIN APPROVAL STATUS BANNER --- */}
      {user?.status === 'Pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-800 shadow-sm animate-pulse">
          <Clock className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-base text-amber-900">Account Approval Pending</h3>
            <p className="text-sm text-amber-700 mt-0.5">
              Your seller registration is currently being reviewed by our administration team. Some features like adding products or completing orders may be restricted until approval.
            </p>
          </div>
        </div>
      )}

      {user?.status === 'Rejected' && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-800 shadow-sm">
          <XCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-base text-rose-900">Application Rejected</h3>
            <p className="text-sm text-rose-700 mt-0.5">
              Your store application was not approved. Please review your submitted business credentials and contact customer support to appeal this decision.
            </p>
          </div>
        </div>
      )}
      {/* --- END STATUS BANNER --- */}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.shopname || 'Seller'}!</h1>
            {user?.status === 'Approved' && (
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">Here is what's happening with your store today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${cards.revenue.toLocaleString()}`} 
          subtitle={`₹${cards.monthlyRevenue.toLocaleString()} this month`}
          icon={IndianRupee} 
          color="bg-[#8E76FF]" 
          lightColor="bg-[#E0E0FB]"
        />
        <StatCard 
          title="Total Orders" 
          value={cards.totalOrders} 
          subtitle={`${cards.pendingOrders} pending`}
          icon={ShoppingBag} 
          color="bg-blue-500" 
          lightColor="bg-blue-100"
        />
        <StatCard 
          title="Total Products" 
          value={cards.totalProducts} 
          subtitle={`${cards.approvedProducts} approved`}
          icon={Package} 
          color="bg-emerald-500" 
          lightColor="bg-emerald-100"
        />
        <StatCard 
          title="Action Needed" 
          value={cards.pendingProducts + cards.rejectedProducts} 
          subtitle={`${cards.pendingProducts} pending, ${cards.rejectedProducts} rejected`}
          icon={TrendingUp} 
          color="bg-amber-500" 
          lightColor="bg-amber-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Overview</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {salesChart.map((item, index) => {
              const heightPercentage = (item.totalSales / maxSales) * 100;
              return (
                <div key={index} className="flex flex-col items-center flex-1 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded mb-2 absolute -mt-8 pointer-events-none">
                    ₹{item.totalSales}
                  </div>
                  <div className="w-full max-w-[40px] bg-[#E0E0FB] rounded-t-md relative flex items-end">
                    <div 
                      className="w-full bg-[#8E76FF] rounded-t-md transition-all duration-500 ease-out"
                      style={{ height: `${heightPercentage}%`, minHeight: heightPercentage > 0 ? '4px' : '0' }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-3">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product & Order Status Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Orders by Status</h2>
            <div className="space-y-4">
              {orderChart.map((item, idx) => (
                <ProgressBar 
                  key={idx} 
                  label={item.status} 
                  count={item.count} 
                  total={cards.totalOrders || 1} 
                  color={getStatusColor(item.status)} 
                />
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Products by Status</h2>
            <div className="space-y-4">
              {productChart.map((item, idx) => (
                <ProgressBar 
                  key={idx} 
                  label={item.status} 
                  count={item.count} 
                  total={cards.totalProducts || 1} 
                  color={getStatusColor(item.status)} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">#{order._id?.substring(0, 8) || 'N/A'}</td>
                    <td className="px-6 py-4">{order.customerName || 'Guest'}</td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBg(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">₹{order.totalAmount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Helpers ---
const StatCard = ({ title, value, subtitle, icon: Icon, color, lightColor }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
    <div className={`p-3 rounded-xl ${lightColor} text-white`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  </div>
);

const ProgressBar = ({ label, count, total, color }) => {
  const percentage = Math.round((count / total) * 100) || 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-900 font-bold">{count}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered': case 'approved': case 'confirmed': return 'bg-emerald-500';
    case 'pending': case 'packed': case 'shipped': return 'bg-[#8E76FF]';
    case 'cancelled': case 'rejected': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

const getStatusBg = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered': case 'approved': case 'confirmed': return 'bg-emerald-100 text-emerald-700';
    case 'pending': case 'packed': case 'shipped': return 'bg-[#E0E0FB] text-[#8E76FF]';
    case 'cancelled': case 'rejected': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default Dashboard;