import { X, Check, Ban } from "lucide-react";

const SellerStatusModal = ({ seller, onClose, onConfirm, loading }) => {
  if (!seller) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#161B2C] border border-[#2A3142] rounded-md w-full max-w-sm p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8991A8] hover:text-[#EDEFF4] transition"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-1">
          Seller Application
        </p>
        <h2 className="text-lg font-semibold text-[#EDEFF4] mb-4">
          {seller.shopname}
        </h2>

        <div className="space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-[#565F78]">Owner</span>
            <span className="text-[#EDEFF4]">{seller.ownername}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#565F78]">Email</span>
            <span className="text-[#EDEFF4]">{seller.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#565F78]">Phone</span>
            <span className="text-[#EDEFF4]">{seller.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#565F78]">Current status</span>
            <span className="text-[#EDEFF4]">{seller.status}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onConfirm("Rejected")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 border border-[#E5484D]/40 text-[#E5484D] hover:bg-[#E5484D]/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium rounded-md py-2.5 transition"
          >
            <Ban size={15} />
            Reject
          </button>
          <button
            onClick={() => onConfirm("Approved")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-[#4ADE80] hover:bg-[#5EE896] disabled:opacity-50 disabled:cursor-not-allowed text-[#0F1320] text-sm font-semibold rounded-md py-2.5 transition"
          >
            {loading ? (
              <span className="h-4 w-4 rounded-full border-2 border-[#0F1320]/40 border-t-[#0F1320] animate-spin" />
            ) : (
              <Check size={15} />
            )}
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerStatusModal;