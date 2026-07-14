import { Eye, Pencil, Ban, CheckCircle2 } from "lucide-react";

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

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const CategoryTable = ({ categories, onView, onEdit, onToggleStatus }) => {
  if (!categories || categories.length === 0) {
    return (
      <p className="text-sm text-[#565F78] py-12 text-center">
        No categories match these filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2A3142] text-left">
            {["Image", "Category", "Status", "Created At", "Actions"].map(
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
          {categories.map((cat) => (
            <tr
              key={cat._id}
              className="border-b border-[#2A3142]/60 last:border-0 hover:bg-[#1A2030] transition-colors"
            >
              <td className="px-5 py-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-10 w-10 rounded-md object-cover border border-[#2A3142]"
                />
              </td>
              <td className="px-5 py-3">
                <button
                  onClick={() => onView(cat)}
                  className="text-[#EDEFF4] font-medium hover:text-[#C9A15C] transition text-left"
                >
                  {cat.name}
                </button>
              </td>
              <td className="px-5 py-3">
                <StatusBadge isActive={cat.isActive} />
              </td>
              <td className="px-5 py-3 text-[#8991A8] whitespace-nowrap">
                {formatDate(cat.createdAt)}
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <button
                    onClick={() => onView(cat)}
                    className="p-1.5 rounded-md border border-[#2A3142] text-[#8991A8] hover:text-[#EDEFF4] hover:border-[#565F78] transition"
                    title="View"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => onEdit(cat)}
                    className="p-1.5 rounded-md border border-[#2A3142] text-[#8991A8] hover:text-[#EDEFF4] hover:border-[#565F78] transition"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  {cat.isActive ? (
                    <button
                      onClick={() => onToggleStatus(cat)}
                      className="p-1.5 rounded-md border border-[#E5484D]/30 text-[#E5484D] hover:bg-[#E5484D]/10 transition"
                      title="Disable"
                    >
                      <Ban size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggleStatus(cat)}
                      className="p-1.5 rounded-md border border-[#4ADE80]/30 text-[#4ADE80] hover:bg-[#4ADE80]/10 transition"
                      title="Enable"
                    >
                      <CheckCircle2 size={14} />
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

export default CategoryTable;