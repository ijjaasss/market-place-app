import { Eye, Check, Ban, Lock, Unlock } from "lucide-react";

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-[#C9A15C]/10 text-[#C9A15C] border-[#C9A15C]/30",
    Approved: "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30",
    Rejected: "bg-[#E5484D]/10 text-[#E5484D] border-[#E5484D]/30",
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

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const SellersTable = ({ sellers, onView, onApprove, onReject, onBlockToggle }) => {
  if (!sellers || sellers.length === 0) {
    return (
      <p className="text-sm text-[#565F78] py-12 text-center">
        No sellers match these filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2A3142] text-left">
            {["Shop", "Owner", "Contact", "GST", "Registered", "Status", "Actions"].map(
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
          {sellers.map((seller) => (
            <tr
              key={seller._id}
              className="border-b border-[#2A3142]/60 last:border-0 hover:bg-[#1A2030] transition-colors"
            >
              <td className="px-5 py-3">
                <button
                  onClick={() => onView(seller)}
                  className="text-[#EDEFF4] font-medium hover:text-[#C9A15C] transition text-left"
                >
                  {seller.shopname}
                </button>
              </td>
              <td className="px-5 py-3 text-[#8991A8]">{seller.ownername}</td>
              <td className="px-5 py-3 text-[#8991A8]">
                <div>{seller.email}</div>
                <div className="text-xs text-[#565F78]">{seller.phone}</div>
              </td>
              <td className="px-5 py-3 text-[#8991A8] whitespace-nowrap">
                {seller.gstNumber}
              </td>
              <td className="px-5 py-3 text-[#8991A8] whitespace-nowrap">
                {formatDate(seller.createdAt)}
              </td>
              <td className="px-5 py-3">
                <div className="flex flex-col gap-1 items-start">
                  <StatusBadge status={seller.status} />
                  {seller.isBlocked && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#E5484D]">
                      <Lock size={10} /> Blocked
                    </span>
                  )}
                </div>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <button
                    onClick={() => onView(seller)}
                    className="p-1.5 rounded-md border border-[#2A3142] text-[#8991A8] hover:text-[#EDEFF4] hover:border-[#565F78] transition"
                    title="View"
                  >
                    <Eye size={14} />
                  </button>

                  {seller.status === "Pending" && (
                    <>
                      <button
                        onClick={() => onApprove(seller)}
                        className="p-1.5 rounded-md border border-[#4ADE80]/30 text-[#4ADE80] hover:bg-[#4ADE80]/10 transition"
                        title="Approve"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => onReject(seller)}
                        className="p-1.5 rounded-md border border-[#E5484D]/30 text-[#E5484D] hover:bg-[#E5484D]/10 transition"
                        title="Reject"
                      >
                        <Ban size={14} />
                      </button>
                    </>
                  )}

                  {seller.status === "Approved" && !seller.isBlocked && (
                    <button
                      onClick={() => onBlockToggle(seller)}
                      className="p-1.5 rounded-md border border-[#E5484D]/30 text-[#E5484D] hover:bg-[#E5484D]/10 transition"
                      title="Block"
                    >
                      <Lock size={14} />
                    </button>
                  )}

                  {seller.isBlocked && (
                    <button
                      onClick={() => onBlockToggle(seller)}
                      className="p-1.5 rounded-md border border-[#4ADE80]/30 text-[#4ADE80] hover:bg-[#4ADE80]/10 transition"
                      title="Unblock"
                    >
                      <Unlock size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellersTable;