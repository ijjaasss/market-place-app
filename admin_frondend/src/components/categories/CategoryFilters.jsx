import { Search, Plus } from "lucide-react";

const STATUS_TABS = [
  { value: "All", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const CategoryFilters = ({
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  onAddClick,
}) => {
  return (
    <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-4 mb-6 flex flex-col lg:flex-row lg:items-center gap-4">
      <div className="relative flex-1 min-w-[220px]">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8991A8]"
        />
        <input
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by category name..."
          className="w-full bg-[#0F1320] border border-[#2A3142] rounded-md pl-9 pr-3 py-2 text-sm text-[#EDEFF4] placeholder:text-[#565F78] focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50 focus:border-[#C9A15C]/50 transition"
        />
      </div>

      <div className="flex items-center gap-1 bg-[#0F1320] border border-[#2A3142] rounded-md p-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onStatusChange(tab.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition ${
              status === tab.value
                ? "bg-[#C9A15C] text-[#161B2C]"
                : "text-[#8991A8] hover:text-[#EDEFF4]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <button
        onClick={onAddClick}
        className="ml-auto flex items-center gap-2 bg-[#C9A15C] hover:bg-[#D9B36E] text-[#161B2C] text-sm font-semibold rounded-md px-4 py-2 transition"
      >
        <Plus size={15} />
        Add Category
      </button>
    </div>
  );
};

export default CategoryFilters;