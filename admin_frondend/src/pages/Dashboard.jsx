import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  Clock,
  IndianRupee,
  CalendarCheck,
  PackageX,
  Bell,
} from "lucide-react";
import { logoutAdmin } from "../features/auth/authSlice";
import { fetchDashboard } from "../features/dashboard/dashboardSlice";
import StatCard from "../components/dashboard/StatCard";
import SimpleBarChart from "../components/dashboard/SimpleBarChart";
import LatestSellersTable from "../components/dashboard/LatestSellersTable";

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.admin);
  const { data, status, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(error);
    }
  }, [status, error]);

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    navigate("/", { replace: true });
  };

  const isLoading = status === "loading" && !data;

  return (
    <div className="min-h-screen bg-[#0F1320] text-[#EDEFF4]">
      {/* header */}
      <header className="border-b border-[#2A3142] px-8 py-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#8991A8] uppercase mb-1">
            Admin Console
          </p>
          <h1 className="text-lg font-semibold">
            Welcome{admin?.name ? `, ${admin.name}` : ""}
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="border border-[#2A3142] hover:border-[#C9A15C]/50 text-sm rounded-md px-4 py-2 transition"
        >
          Log out
        </button>
      </header>

      <main className="px-8 py-8 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
          </div>
        ) : !data ? (
          <p className="text-[#565F78] text-sm">
            Couldn't load dashboard data.
          </p>
        ) : (
          <>
            {/* notifications */}
            {data.notifications?.length > 0 && (
              <div className="mb-8 space-y-2">
                {data.notifications.map((n, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-[#161B2C] border border-[#C9A15C]/30 rounded-md px-4 py-3 text-sm"
                  >
                    <Bell size={15} className="text-[#C9A15C] shrink-0" />
                    <span className="text-[#EDEFF4]">{n.message}</span>
                  </div>
                ))}
              </div>
            )}

            {/* stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Users"
                value={data.stats.totalUsers}
                icon={Users}
              />
              <StatCard
                label="Total Sellers"
                value={data.stats.totalSellers}
                icon={Store}
                hint={`${data.stats.pendingSellers} pending`}
                accent={data.stats.pendingSellers > 0}
              />
              <StatCard
                label="Total Products"
                value={data.stats.totalProducts}
                icon={Package}
                hint={`${data.stats.pendingProducts} pending`}
              />
              <StatCard
                label="Total Orders"
                value={data.stats.totalOrders}
                icon={ShoppingCart}
              />
              <StatCard
                label="Pending Sellers"
                value={data.stats.pendingSellers}
                icon={Clock}
                accent
              />
              <StatCard
                label="Pending Products"
                value={data.stats.pendingProducts}
                icon={PackageX}
              />
              <StatCard
                label="Revenue"
                value={currency(data.stats.revenue)}
                icon={IndianRupee}
              />
              <StatCard
                label="Today's Orders"
                value={data.stats.todayOrders}
                icon={CalendarCheck}
              />
            </div>

            {/* charts */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5">
                <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-4">
                  Monthly Sales
                </p>
                <SimpleBarChart
                  data={data.charts.monthlySales}
                  labelKey="month"
                  valueKey="totalSales"
                  color="#C9A15C"
                />
              </div>
              <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5">
                <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-4">
                  Orders by Month
                </p>
                <SimpleBarChart
                  data={data.charts.ordersByMonth}
                  labelKey="month"
                  valueKey="totalOrders"
                  color="#8991A8"
                />
              </div>
            </div>

            {/* latest sellers */}
            <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5 mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase">
                  Latest Sellers
                </p>
              </div>
              <LatestSellersTable sellers={data.latestSellers} />
            </div>

            {/* latest products / orders */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5">
                <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-4">
                  Latest Products
                </p>
                {data.latestProducts?.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {data.latestProducts.map((p) => (
                      <li key={p._id} className="text-[#8991A8]">
                        {p.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#565F78] py-6 text-center">
                    No products yet.
                  </p>
                )}
              </div>
              <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5">
                <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-4">
                  Latest Orders
                </p>
                {data.latestOrders?.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {data.latestOrders.map((o) => (
                      <li key={o._id} className="text-[#8991A8]">
                        {o._id}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#565F78] py-6 text-center">
                    No orders yet.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;