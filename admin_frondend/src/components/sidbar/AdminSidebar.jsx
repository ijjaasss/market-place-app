import React, { useState } from "react";
import {
  LayoutDashboard,
  Store,
  Users,
  FolderTree,
  Package,
  ShoppingCart,
  Star,
  UserCircle,
  LogOut,
  Menu,
  X,
  BanknoteArrowDown
} from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "sellers", label: "Seller Management", icon: Store },
  { key: "users", label: "User Management", icon: Users },
  { key: "categories", label: "Category Management", icon: FolderTree },
  { key: "products", label: "Product Management", icon: Package },
  { key: "orders", label: "Order Management", icon: ShoppingCart },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "Withdrawals", label: "Withdrawals", icon: BanknoteArrowDown  },
];

export default function AdminSidebar({
  active = "dashboard",
  onNavigate = () => {},
  onLogout = () => {},
  adminName = "Admin",
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (key) => {
    onNavigate(key);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between bg-slate-900 text-slate-100 px-4 py-3 md:hidden">
        <span className="font-semibold tracking-wide text-sm">ADMIN PANEL</span>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="p-1.5 rounded-md hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay on mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-40
          h-screen w-64 flex flex-col
          bg-slate-900 text-slate-300
          transform transition-transform duration-200 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        {/* Logo / brand */}
        <div className="flex items-center gap-2 px-5 h-16 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white text-sm">
            A
          </div>
          <span className="text-white font-semibold tracking-wide text-sm">
            ADMIN PANEL
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-colors duration-150
                  ${
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100 border-l-2 border-transparent"
                  }
                `}
              >
                <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile + Logout footer */}
        <div className="border-t border-slate-800 px-3 py-4">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-semibold">
              {adminName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-slate-100 text-sm font-medium">{adminName}</span>
              <span className="text-slate-500 text-xs">Administrator</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                       text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}