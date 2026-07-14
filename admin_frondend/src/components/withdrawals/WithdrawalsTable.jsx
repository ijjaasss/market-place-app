import { Eye } from "lucide-react";

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-[#C9A15C]/10 text-[#C9A15C] border-[#C9A15C]/30",
    Approved: "bg-[#5B8DEF]/10 text-[#5B8DEF] border-[#5B8DEF]/30",
    Rejected: "bg-[#E5484D]/10 text-[#E5484D] border-[#E5484D]/30",
    Paid: "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30",
  };
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
};

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const WithdrawalsTable = ({ withdrawals, onView }) => {
  if (!withdrawals || withdrawals.length === 0) {
    return (
      <p className="text-sm text-[#565F78] py-12 text-center">
        No withdrawal requests match these filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2A3142] text-left">
            {["Seller", "Shop", "Amount", "Status", "Requested", "Action"].map(
              (h) => (
                <th
                  key={h}
                  className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-2 whitespace-nowrap"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((w) => (
            <tr
              key={w._id}
              className="border-b border-[#2A3142]/60 last:border-0 hover:bg-[#1A2030] transition-colors"
            >
              <td className="px-5 py-3 text-[#EDEFF4] font-medium">
                {w.sellerName}
              </td>
              <td className="px-5 py-3 text-[#8991A8]">{w.shopName}</td>
              <td className="px-5 py-3 text-[#8991A8] tabular-nums whitespace-nowrap">
                {currency(w.amount)}
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={w.status} />
              </td>
              <td className="px-5 py-3 text-[#8991A8] whitespace-nowrap">
                {formatDate(w.requestedAt)}
              </td>
              <td className="px-5 py-3">
                <button
                  onClick={() => onView(w)}
                  className="flex items-center gap-1.5 p-1.5 rounded-md border border-[#2A3142] text-[#8991A8] hover:text-[#EDEFF4] hover:border-[#565F78] transition"
                  title="View"
                >
                  <Eye size={14} />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WithdrawalsTable;