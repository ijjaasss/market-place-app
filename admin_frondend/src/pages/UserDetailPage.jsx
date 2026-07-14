import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  UserCircle2,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Lock,
  Unlock,
} from "lucide-react";
import {
  fetchUserById,
  toggleUserStatus,
  clearSelectedUser,
} from "../features/users/usersSlice";
import ConfirmDialog from "../components/shared/ConfirmDialog";

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5 flex items-start justify-between">
    <div>
      <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-2">
        {label}
      </p>
      <p className="text-2xl font-semibold text-[#EDEFF4] tabular-nums">
        {value}
      </p>
    </div>
    <div className="h-9 w-9 rounded-md flex items-center justify-center border bg-[#0F1320] border-[#2A3142] text-[#8991A8]">
      <Icon size={16} />
    </div>
  </div>
);

const OrderStatusBadge = ({ status }) => {
  const styles = {
    Delivered: "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30",
    Cancelled: "bg-[#E5484D]/10 text-[#E5484D] border-[#E5484D]/30",
  };
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${
        styles[status] ||
        "bg-[#C9A15C]/10 text-[#C9A15C] border-[#C9A15C]/30"
      }`}
    >
      {status}
    </span>
  );
};

const UserDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedUser, statistics, recentOrders, detailStatus, actionStatus } =
    useSelector((state) => state.users);

  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserById(id));
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, id]);

  const isBlocked = selectedUser?.status === "Blocked";

  const handleConfirm = async () => {
    const result = await dispatch(
      toggleUserStatus({ id, isBlocked: !isBlocked })
    );
    if (toggleUserStatus.fulfilled.match(result)) {
      toast.success(`User ${!isBlocked ? "blocked" : "unblocked"}.`);
      setConfirmOpen(false);
    } else {
      toast.error(result.payload || "Failed to update status");
    }
  };

  if (detailStatus === "loading" || !selectedUser) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        to="/users"
        className="inline-flex items-center gap-2 text-sm text-[#8991A8] hover:text-[#EDEFF4] transition mb-6"
      >
        <ArrowLeft size={15} />
        Back to Users
      </Link>

      {/* profile header */}
      <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {selectedUser.profileImage ? (
            <img
              src={selectedUser.profileImage}
              alt={selectedUser.name}
              className="h-16 w-16 rounded-full object-cover border border-[#2A3142]"
            />
          ) : (
            <UserCircle2 size={56} className="text-[#565F78]" />
          )}
          <div>
            <h1 className="text-lg font-semibold text-[#EDEFF4]">
              {selectedUser.name}
            </h1>
            <p className="text-sm text-[#8991A8]">{selectedUser.email}</p>
            <p className="text-sm text-[#8991A8]">{selectedUser.phone}</p>
            <p className="text-xs text-[#565F78] mt-1">
              Joined {formatDate(selectedUser.joinedDate)}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span
            className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${
              isBlocked
                ? "bg-[#E5484D]/10 text-[#E5484D] border-[#E5484D]/30"
                : "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30"
            }`}
          >
            {selectedUser.status}
          </span>
          <button
            onClick={() => setConfirmOpen(true)}
            className={`flex items-center gap-2 text-sm font-medium rounded-md px-4 py-2 transition ${
              isBlocked
                ? "bg-[#4ADE80] hover:bg-[#5EE896] text-[#0F1320]"
                : "border border-[#E5484D]/40 text-[#E5484D] hover:bg-[#E5484D]/10"
            }`}
          >
            {isBlocked ? <Unlock size={15} /> : <Lock size={15} />}
            {isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      </div>

      {/* order statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Orders"
          value={statistics?.totalOrders ?? 0}
          icon={ShoppingBag}
        />
        <StatCard
          label="Completed Orders"
          value={statistics?.completedOrders ?? 0}
          icon={CheckCircle2}
        />
        <StatCard
          label="Cancelled Orders"
          value={statistics?.cancelledOrders ?? 0}
          icon={XCircle}
        />
        <StatCard
          label="Total Spent"
          value={currency(statistics?.totalSpent)}
          icon={IndianRupee}
        />
      </div>

      {/* recent orders */}
      <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5">
        <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-4">
          Recent Orders
        </p>
        {recentOrders?.length > 0 ? (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A3142] text-left">
                  {["Order ID", "Date", "Amount", "Status"].map((h) => (
                    <th
                      key={h}
                      className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-2 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-b border-[#2A3142]/60 last:border-0"
                  >
                    <td className="px-5 py-3 text-[#EDEFF4] font-medium">
                      {order.orderId}
                    </td>
                    <td className="px-5 py-3 text-[#8991A8] whitespace-nowrap">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-5 py-3 text-[#8991A8] tabular-nums">
                      {currency(order.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-[#565F78] py-6 text-center">
            No orders yet.
          </p>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={isBlocked ? "Unblock this user?" : "Block this user?"}
        description={`${selectedUser.name} — ${selectedUser.email}`}
        confirmLabel={isBlocked ? "Unblock" : "Block"}
        tone={isBlocked ? "positive" : "danger"}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        loading={actionStatus === "loading"}
      />
    </div>
  );
};

export default UserDetailPage;