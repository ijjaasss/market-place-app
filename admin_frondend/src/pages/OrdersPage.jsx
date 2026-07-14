import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Clock, CheckCircle2, Truck, PackageCheck, XCircle, Search } from "lucide-react";
import { fetchOrders, setFilters } from "../features/orders/ordersSlice";
import Pagination from "../components/shared/Pagination";

// Utility formatting
const currency = (val) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);
const formatDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// Local Components for this page to keep it self-contained
const StatCard = ({ label, value, icon: Icon, accent }) => (
  <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5 flex items-start justify-between">
    <div>
      <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-2">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${accent ? "text-[#C9A15C]" : "text-[#EDEFF4]"}`}>{value}</p>
    </div>
    <div className="h-9 w-9 rounded-md flex items-center justify-center border bg-[#0F1320] border-[#2A3142] text-[#8991A8]">
      <Icon size={16} />
    </div>
  </div>
);

const StatusBadge = ({ status, type = "order" }) => {
  let colors = "bg-[#C9A15C]/10 text-[#C9A15C] border-[#C9A15C]/30"; // Default pending/gold
  
  if (status === "Delivered" || status === "Paid") colors = "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30";
  else if (status === "Cancelled" || status === "Failed") colors = "bg-[#E5484D]/10 text-[#E5484D] border-[#E5484D]/30";
  else if (status === "Confirmed" || status === "Packed" || status === "Shipped") colors = "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30";

  return <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${colors}`}>{status}</span>;
};

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, summary, listStatus, filters, totalPages } = useSelector((state) => state.orders);
  
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce Search
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== filters.search) dispatch(setFilters({ search: searchInput, page: 1 }));
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput, filters.search, dispatch]);

  useEffect(() => {
    dispatch(fetchOrders(filters));
  }, [dispatch, filters]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#8991A8] uppercase mb-1">Fulfillment</p>
        <h1 className="text-lg font-semibold text-[#EDEFF4]">Order Management</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <StatCard label="Total" value={summary.totalOrders} icon={ShoppingCart} />
        <StatCard label="Pending" value={summary.pendingOrders} icon={Clock} accent />
        <StatCard label="Confirmed" value={summary.confirmedOrders} icon={CheckCircle2} />
        <StatCard label="Shipped" value={summary.shippedOrders} icon={Truck} />
        <StatCard label="Delivered" value={summary.deliveredOrders} icon={PackageCheck} />
        <StatCard label="Cancelled" value={summary.cancelledOrders} icon={XCircle} />
      </div>

      {/* Filters */}
      <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#565F78]" />
          <input
            type="text"
            placeholder="Search Name or Phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-[#0F1320] border border-[#2A3142] rounded-md pl-9 pr-3 py-2 text-sm text-[#EDEFF4] placeholder:text-[#565F78] focus:outline-none focus:ring-1 focus:ring-[#C9A15C]/50 focus:border-[#C9A15C]/50"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => dispatch(setFilters({ status: e.target.value, page: 1 }))}
          className="bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2 text-sm text-[#EDEFF4] focus:outline-none focus:border-[#C9A15C]/50 min-w-[140px]"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Packed">Packed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select
          value={filters.payment}
          onChange={(e) => dispatch(setFilters({ payment: e.target.value, page: 1 }))}
          className="bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2 text-sm text-[#EDEFF4] focus:outline-none focus:border-[#C9A15C]/50 min-w-[140px]"
        >
          <option value="">All Payments</option>
          <option value="COD">COD</option>
          <option value="Online">Online</option>
        </select>
        <select
          value={filters.sort}
          onChange={(e) => dispatch(setFilters({ sort: e.target.value, page: 1 }))}
          className="bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2 text-sm text-[#EDEFF4] focus:outline-none focus:border-[#C9A15C]/50 min-w-[140px]"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#161B2C] border border-[#2A3142] rounded-md overflow-hidden">
        {listStatus === "loading" ? (
          <div className="flex items-center justify-center py-16">
            <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-[#2A3142] bg-[#0F1320]/50">
                <tr>
                  {["Order ID", "Customer", "Date", "Amount", "Payment", "Order Status"].map((h) => (
                    <th key={h} className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="6" className="px-5 py-8 text-center text-[#565F78]">No orders found matching filters.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr 
                      key={order._id} 
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="border-b border-[#2A3142]/60 last:border-0 hover:bg-[#2A3142]/20 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3 text-[#EDEFF4] font-mono text-xs">{order._id.slice(-8).toUpperCase()}</td>
                      <td className="px-5 py-3 text-[#EDEFF4]">
                        <p className="font-medium">{order.shippingAddress?.fullName}</p>
                        <p className="text-xs text-[#8991A8]">{order.shippingAddress?.phone}</p>
                      </td>
                      <td className="px-5 py-3 text-[#8991A8] whitespace-nowrap">{formatDate(order.createdAt)}</td>
                      <td className="px-5 py-3 text-[#EDEFF4] tabular-nums font-medium">{currency(order.totalAmount)}</td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="text-xs text-[#8991A8]">{order.paymentMethod}</span>
                          <StatusBadge status={order.paymentStatus} />
                        </div>
                      </td>
                      <td className="px-5 py-3"><StatusBadge status={order.orderStatus} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={(page) => dispatch(setFilters({ page }))} />
      </div>
    </div>
  );
};

export default OrdersPage;