import { Eye, Check, Ban, Trash2 } from "lucide-react";

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

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const ProductTable = ({ products, onView, onApprove, onReject, onDelete }) => {
  if (!products || products.length === 0) {
    return (
      <p className="text-sm text-[#565F78] py-12 text-center">
        No products match these filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2A3142] text-left">
            {[
              "Image",
              "Product",
              "Seller",
              "Category",
              "Brand",
              "Price",
              "Stock",
              "Status",
              "Actions",
            ].map((h) => (
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
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-b border-[#2A3142]/60 last:border-0 hover:bg-[#1A2030] transition-colors"
            >
              <td className="px-5 py-3">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="h-10 w-10 rounded-md object-cover border border-[#2A3142]"
                />
              </td>
              <td className="px-5 py-3">
                <button
                  onClick={() => onView(product)}
                  className="text-[#EDEFF4] font-medium hover:text-[#C9A15C] transition text-left"
                >
                  {product.name}
                </button>
              </td>
              <td className="px-5 py-3 text-[#8991A8] whitespace-nowrap">
                {product.seller?.shopname}
              </td>
              <td className="px-5 py-3 text-[#8991A8] whitespace-nowrap">
                {product.category?.name}
              </td>
              <td className="px-5 py-3 text-[#8991A8] whitespace-nowrap">
                {product.brand}
              </td>
              <td className="px-5 py-3 text-[#8991A8] whitespace-nowrap tabular-nums">
                {currency(product.price)}
              </td>
              <td className="px-5 py-3 text-[#8991A8] tabular-nums">
                {product.stock}
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={product.status} />
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <button
                    onClick={() => onView(product)}
                    className="p-1.5 rounded-md border border-[#2A3142] text-[#8991A8] hover:text-[#EDEFF4] hover:border-[#565F78] transition"
                    title="View"
                  >
                    <Eye size={14} />
                  </button>
                  {product.status === "Pending" && (
                    <>
                      <button
                        onClick={() => onApprove(product)}
                        className="p-1.5 rounded-md border border-[#4ADE80]/30 text-[#4ADE80] hover:bg-[#4ADE80]/10 transition"
                        title="Approve"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => onReject(product)}
                        className="p-1.5 rounded-md border border-[#E5484D]/30 text-[#E5484D] hover:bg-[#E5484D]/10 transition"
                        title="Reject"
                      >
                        <Ban size={14} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onDelete(product)}
                    className="p-1.5 rounded-md border border-[#2A3142] text-[#8991A8] hover:text-[#E5484D] hover:border-[#E5484D]/40 transition"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;