import { X, Check, Ban, Trash2 } from "lucide-react";
import { useState } from "react";

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
    <p className="text-sm text-[#EDEFF4]">{value ?? "—"}</p>
  </div>
);

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const ProductViewModal = ({
  product,
  loading,
  onClose,
  onApprove,
  onReject,
  onDelete,
}) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!product && !loading) return null;

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

        {loading || !product ? (
          <div className="flex items-center justify-center py-24">
            <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
          </div>
        ) : (
          <>
            {/* image gallery */}
            {product.images?.length > 0 && (
              <div className="mb-6">
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-56 object-cover rounded-md border border-[#2A3142] mb-2"
                />
                {product.images.length > 1 && (
                  <div className="flex gap-2">
                    {product.images.map((img, i) => (
                      <button
                        key={img}
                        onClick={() => setActiveImage(i)}
                        className={`h-14 w-14 rounded-md overflow-hidden border-2 transition ${
                          i === activeImage
                            ? "border-[#C9A15C]"
                            : "border-[#2A3142] opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[#EDEFF4]">
                  {product.name}
                </h2>
                <p className="text-sm text-[#8991A8]">{product.brand}</p>
              </div>
              <StatusBadge status={product.status} />
            </div>

            {product.status === "Rejected" && product.rejectReason && (
              <div className="mb-4 bg-[#E5484D]/10 border border-[#E5484D]/30 rounded-md px-4 py-3">
                <p className="font-mono text-[10px] tracking-[0.15em] text-[#E5484D] uppercase mb-1">
                  Reject Reason
                </p>
                <p className="text-sm text-[#EDEFF4]">
                  {product.rejectReason}
                </p>
              </div>
            )}

            <p className="font-mono text-[10px] tracking-[0.15em] text-[#C9A15C] uppercase mb-3">
              Product Details
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Category" value={product.category?.name} />
              <Field label="Price" value={currency(product.price)} />
              <Field label="Stock" value={product.stock} />
              <Field label="Brand" value={product.brand} />
            </div>
            <div className="mb-6">
              <Field label="Description" value={product.description} />
            </div>

            <p className="font-mono text-[10px] tracking-[0.15em] text-[#C9A15C] uppercase mb-3">
              Seller
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Field label="Owner" value={product.seller?.ownername} />
              <Field label="Shop" value={product.seller?.shopname} />
              <Field label="Email" value={product.seller?.email} />
              <Field label="Phone" value={product.seller?.phone} />
            </div>

            {/* actions */}
            <div className="flex gap-3 pt-4 border-t border-[#2A3142]">
              {product.status === "Pending" && (
                <>
                  <button
                    onClick={onReject}
                    className="flex-1 flex items-center justify-center gap-2 border border-[#E5484D]/40 text-[#E5484D] hover:bg-[#E5484D]/10 text-sm font-medium rounded-md py-2.5 transition"
                  >
                    <Ban size={15} />
                    Reject
                  </button>
                  <button
                    onClick={onApprove}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#4ADE80] hover:bg-[#5EE896] text-[#0F1320] text-sm font-semibold rounded-md py-2.5 transition"
                  >
                    <Check size={15} />
                    Approve
                  </button>
                </>
              )}
              <button
                onClick={onDelete}
                className="flex items-center justify-center gap-2 border border-[#2A3142] hover:border-[#E5484D]/40 hover:text-[#E5484D] text-[#8991A8] text-sm font-medium rounded-md py-2.5 px-4 transition"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductViewModal;