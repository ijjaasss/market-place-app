import { X, Check, Ban, Lock, Unlock } from "lucide-react";

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

const Field = ({ label, value }) => (
  <div>
    <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-1">
      {label}
    </p>
    <p className="text-sm text-[#EDEFF4]">{value || "—"}</p>
  </div>
);

const SellerViewModal = ({
  seller,
  loading,
  onClose,
  onApprove,
  onReject,
  onBlockToggle,
}) => {
  if (!seller && !loading) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="bg-[#161B2C] border border-[#2A3142] rounded-md w-full max-w-2xl max-h-full overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8991A8] hover:text-[#EDEFF4] transition"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {loading || !seller ? (
          <div className="flex items-center justify-center py-24">
            <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
          </div>
        ) : (
          <>
            {/* header */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={seller.logo}
                alt={seller.shopname}
                className="h-14 w-14 rounded-md object-cover border border-[#2A3142]"
              />
              <div>
                <h2 className="text-lg font-semibold text-[#EDEFF4]">
                  {seller.shopname}
                </h2>
                <p className="text-sm text-[#8991A8]">{seller.ownername}</p>
              </div>
              <div className="ml-auto">
                <StatusBadge status={seller.status} />
              </div>
            </div>

            {/* basic info */}
            <p className="font-mono text-[10px] tracking-[0.15em] text-[#C9A15C] uppercase mb-3">
              Basic Information
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Field label="Email" value={seller.email} />
              <Field label="Phone" value={seller.phone} />
              <Field label="GST Number" value={seller.gstNumber} />
              <Field label="Pincode" value={seller.pincode} />
              <Field label="Address" value={seller.address} />
              <Field label="City" value={seller.city} />
              <Field label="State" value={seller.state} />
              <Field label="Country" value={seller.country} />
            </div>
            <div className="mb-6">
              <Field label="Description" value={seller.description} />
            </div>

            {/* id proof */}
            <p className="font-mono text-[10px] tracking-[0.15em] text-[#C9A15C] uppercase mb-3">
              ID Proof
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {["front", "back"].map((side) => (
                <div key={side}>
                  <p className="text-xs text-[#8991A8] mb-2 capitalize">
                    {side} image
                  </p>
                  {seller.idProof?.[side] ? (
                    <div className="space-y-2">
                      <img
                        src={seller.idProof[side]}
                        alt={`ID proof ${side}`}
                        className="w-full h-32 object-cover rounded-md border border-[#2A3142]"
                      />
                      <a
                        href={seller.idProof[side]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-[#C9A15C] hover:underline"
                      >
                        Open full image
                      </a>
                    </div>
                  ) : (
                    <div className="h-32 flex items-center justify-center rounded-md border border-dashed border-[#2A3142] text-xs text-[#565F78]">
                      Not provided
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* actions */}
            <div className="flex gap-3 pt-2 border-t border-[#2A3142] mt-2">
              {seller.status === "Pending" && (
                <>
                  <button
                    onClick={onReject}
                    className="flex-1 flex items-center justify-center gap-2 border border-[#E5484D]/40 text-[#E5484D] hover:bg-[#E5484D]/10 text-sm font-medium rounded-md py-2.5 mt-4 transition"
                  >
                    <Ban size={15} />
                    Reject
                  </button>
                  <button
                    onClick={onApprove}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#4ADE80] hover:bg-[#5EE896] text-[#0F1320] text-sm font-semibold rounded-md py-2.5 mt-4 transition"
                  >
                    <Check size={15} />
                    Approve
                  </button>
                </>
              )}

              {seller.status === "Approved" && !seller.isBlocked && (
                <button
                  onClick={onBlockToggle}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#E5484D]/40 text-[#E5484D] hover:bg-[#E5484D]/10 text-sm font-medium rounded-md py-2.5 mt-4 transition"
                >
                  <Lock size={15} />
                  Block
                </button>
              )}

              {seller.isBlocked && (
                <button
                  onClick={onBlockToggle}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#4ADE80] hover:bg-[#5EE896] text-[#0F1320] text-sm font-semibold rounded-md py-2.5 mt-4 transition"
                >
                  <Unlock size={15} />
                  Unblock
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SellerViewModal;