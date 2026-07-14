const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Show a window of up to 5 page numbers centered on the current page.
  const windowSize = 5;
  let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  let end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1.5 text-xs font-medium rounded-md border border-[#2A3142] text-[#8991A8] hover:text-[#EDEFF4] hover:border-[#565F78] disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        &laquo; Previous
      </button>

      {start > 1 && <span className="text-[#565F78] text-xs px-1">...</span>}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`h-8 w-8 text-xs font-medium rounded-md border transition ${
            p === currentPage
              ? "bg-[#C9A15C] border-[#C9A15C] text-[#161B2C]"
              : "border-[#2A3142] text-[#8991A8] hover:text-[#EDEFF4] hover:border-[#565F78]"
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <span className="text-[#565F78] text-xs px-1">...</span>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1.5 text-xs font-medium rounded-md border border-[#2A3142] text-[#8991A8] hover:text-[#EDEFF4] hover:border-[#565F78] disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next &raquo;
      </button>
    </div>
  );
};

export default Pagination;