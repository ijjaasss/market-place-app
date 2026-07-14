import { Search } from "lucide-react";

const STATUS_TABS = ["All", "Pending", "Approved", "Rejected"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "shop", label: "Shop Name" },
  { value: "name", label: "Owner Name" },
];
const ROW_OPTIONS = [10, 25, 50];

const SellerFilters = ({
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  limit,
  onLimitChange,
}) => {
  return (
    <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-4 mb-6 flex flex-col lg:flex-row lg:items-center gap-4">
      {/* search */}
      <div className="relative flex-1 min-w-[220px]">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8991A8]"
        />
        <input
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by shop, owner, email or phone..."
          className="w-full bg-[#0F1320] border border-[#2A3142] rounded-md pl-9 pr-3 py-2 text-sm text-[#EDEFF4] placeholder:text-[#565F78] focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50 focus:border-[#C9A15C]/50 transition"
        />
      </div>

      {/* status tabs */}
      <div className="flex items-center gap-1 bg-[#0F1320] border border-[#2A3142] rounded-md p-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onStatusChange(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition ${
              status === tab
                ? "bg-[#C9A15C] text-[#161B2C]"
                : "text-[#8991A8] hover:text-[#EDEFF4]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* sort */}
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

      {/* rows per page */}
      <select
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2 text-sm text-[#EDEFF4] focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50"
      >
        {ROW_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n} rows
          </option>
        ))}
      </select>
    </div>
  );
};

export default SellerFilters;