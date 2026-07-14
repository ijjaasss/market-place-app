import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateSellerStatus } from "../../features/dashboard/dashboardSlice";
import SellerStatusModal from "./SellerStatusModal";

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-[#C9A15C]/10 text-[#C9A15C] border-[#C9A15C]/30",
    Accepted: "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30",
    Approved: "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30",
    Rejected: "bg-[#E5484D]/10 text-[#E5484D] border-[#E5484D]/30",
  };
  const style = styles[status] || styles.Pending;

  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${style}`}
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

const LatestSellersTable = ({ sellers }) => {
  const dispatch = useDispatch();
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleConfirm = async (status) => {
    setActionLoading(true);
    const result = await dispatch(
      updateSellerStatus({ id: selectedSeller._id, status })
    );
    setActionLoading(false);

    if (updateSellerStatus.fulfilled.match(result)) {
      toast.success(`${selectedSeller.shopname} ${status.toLowerCase()}.`);
      setSelectedSeller(null);
    } else {
      toast.error(result.payload || "Failed to update seller status");
    }
  };

  if (!sellers || sellers.length === 0) {
    return (
      <p className="text-sm text-[#565F78] py-6 text-center">
        No sellers yet.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A3142] text-left">
              <th className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-2">
                Shop
              </th>
              <th className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-2">
                Owner
              </th>
              <th className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-2">
                Contact
              </th>
              <th className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-2">
                Registered
              </th>
              <th className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-2">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr
                key={seller._id}
                onClick={() => setSelectedSeller(seller)}
                className="border-b border-[#2A3142]/60 last:border-0 hover:bg-[#1A2030] transition-colors cursor-pointer"
              >
                <td className="px-5 py-3 text-[#EDEFF4] font-medium">
                  {seller.shopname}
                </td>
                <td className="px-5 py-3 text-[#8991A8]">
                  {seller.ownername}
                </td>
                <td className="px-5 py-3 text-[#8991A8]">
                  <div>{seller.email}</div>
                  <div className="text-xs text-[#565F78]">{seller.phone}</div>
                </td>
                <td className="px-5 py-3 text-[#8991A8] whitespace-nowrap">
                  {formatDate(seller.createdAt)}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={seller.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SellerStatusModal
        seller={selectedSeller}
        onClose={() => !actionLoading && setSelectedSeller(null)}
        onConfirm={handleConfirm}
        loading={actionLoading}
      />
    </>
  );
};

export default LatestSellersTable;