import { Search } from "lucide-react";

const STATUS_OPTIONS = ["All", "Pending", "Approved", "Rejected"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

const ProductFilters = ({
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  categoryOptions,
  sort,
  onSortChange,
}) => {
  return (
    <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-4 mb-6 flex flex-col lg:flex-row lg:items-center gap-3">
      <div className="relative flex-1 min-w-[220px]">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8991A8]"
        />
        <input
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by product name or brand..."
          className="w-full bg-[#0F1320] border border-[#2A3142] rounded-md pl-9 pr-3 py-2 text-sm text-[#EDEFF4] placeholder:text-[#565F78] focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50 focus:border-[#C9A15C]/50 transition"
        />
      </div>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2 text-sm text-[#EDEFF4] focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50"
      >
        <option value="All">All Categories</option>
        {categoryOptions.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2 text-sm text-[#EDEFF4] focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s === "All" ? "All Statuses" : s}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2 text-sm text-[#EDEFF4] focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductFilters;