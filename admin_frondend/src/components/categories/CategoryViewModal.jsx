import { X } from "lucide-react";

const StatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${
      isActive
        ? "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30"
        : "bg-[#8991A8]/10 text-[#8991A8] border-[#8991A8]/30"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

const Field = ({ label, value }) => (
  <div>
    <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-1">
      {label}
    </p>
    <p className="text-sm text-[#EDEFF4]">{value ?? "—"}</p>
  </div>
);

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const CategoryViewModal = ({ category, productCount, loading, onClose }) => {
  if (!category && !loading) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#161B2C] border border-[#2A3142] rounded-md w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8991A8] hover:text-[#EDEFF4] transition"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {loading || !category ? (
          <div className="flex items-center justify-center py-20">
            <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <img
                src={category.image}
                alt={category.name}
                className="h-16 w-16 rounded-md object-cover border border-[#2A3142]"
              />
              <div>
                <h2 className="text-lg font-semibold text-[#EDEFF4]">
                  {category.name}
                </h2>
                <div className="mt-1">
                  <StatusBadge isActive={category.isActive} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Product Count" value={productCount} />
              <Field
                label="Created"
                value={formatDateTime(category.createdAt)}
              />
              <Field
                label="Updated"
                value={formatDateTime(category.updatedAt)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryViewModal;