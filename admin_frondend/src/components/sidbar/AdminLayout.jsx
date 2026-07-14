import { useNavigate, useLocation, Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { logoutAdmin } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

// maps sidebar "key" -> actual route path
const ROUTE_MAP = {
  dashboard: "/dashboard",
  sellers: "/sellers",
  users: "/users",
  categories: "/categories",
  products: "/products",
  orders: "/orders",
  reviews: "/reviews",
   Withdrawals: "/withdrawals",
};

const getActiveKey = (pathname) => {
  const match = Object.entries(ROUTE_MAP).find(([, path]) =>
    path === "/admin" ? pathname === "/admin" : pathname.startsWith(path)
  );
  return match ? match[0] : "dashboard";
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
 const dispatch=useDispatch()
  const handleNavigate = (key) => {
    navigate(ROUTE_MAP[key]);
  };

  const handleLogout = async() => {
    await dispatch(logoutAdmin());
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#0F1320]">
      <AdminSidebar
        active={getActiveKey(location.pathname)}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        adminName="Rahul"
      />
      <main className="flex-1 p overflow-y-auto">

        <Outlet />
      </main>
    </div>
  );
}