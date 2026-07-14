import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Star, EyeOff, Calendar, Search } from "lucide-react";
import { fetchReviews, setFilters } from "../features/reviews/reviewsSlice";
import Pagination from "../components/shared/Pagination"; // Assuming you have this

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const StatCard = ({ label, value, icon: Icon, accent }) => (
  <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5 flex items-start justify-between">
    <div>
      <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-2">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${accent ? "text-[#C9A15C]" : "text-[#EDEFF4]"}`}>
        {value}
      </p>
    </div>
    <div className="h-9 w-9 rounded-md flex items-center justify-center border bg-[#0F1320] border-[#2A3142] text-[#8991A8]">
      <Icon size={16} />
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const isHidden = status === "Hidden";
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${
        isHidden
          ? "bg-[#E5484D]/10 text-[#E5484D] border-[#E5484D]/30"
          : "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30"
      }`}
    >
      {status}
    </span>
  );
};

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "text-[#C9A15C] fill-[#C9A15C]" : "text-[#565F78]"}
        />
      ))}
    </div>
  );
};

const ReviewsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reviews, summary, listStatus, filters, totalPages } = useSelector((state) => state.reviews);

  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== filters.search) dispatch(setFilters({ search: searchInput, page: 1 }));
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput, filters.search, dispatch]);

  useEffect(() => {
    dispatch(fetchReviews(filters));
  }, [dispatch, filters]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#8991A8] uppercase mb-1">Feedback</p>
        <h1 className="text-lg font-semibold text-[#EDEFF4]">Review Management</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Reviews" value={summary.totalReviews} icon={MessageSquare} />
        <StatCard label="5 Star Reviews" value={summary.fiveStarReviews} icon={Star} accent />
        <StatCard label="Hidden Reviews" value={summary.hiddenReviews} icon={EyeOff} />
        <StatCard label="Today's Reviews" value={summary.todaysReviews} icon={Calendar} />
      </div>

      {/* Filters */}
      <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#565F78]" />
          <input
            type="text"
            placeholder="Search User or Product..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-[#0F1320] border border-[#2A3142] rounded-md pl-9 pr-3 py-2 text-sm text-[#EDEFF4] placeholder:text-[#565F78] focus:outline-none focus:ring-1 focus:ring-[#C9A15C]/50"
          />
        </div>
        <select
          value={filters.rating}
          onChange={(e) => dispatch(setFilters({ rating: e.target.value, page: 1 }))}
          className="bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2 text-sm text-[#EDEFF4] focus:outline-none focus:border-[#C9A15C]/50"
        >
          <option value="">All Ratings</option>
          <option value="5">⭐⭐⭐⭐⭐ (5)</option>
          <option value="4">⭐⭐⭐⭐ (4)</option>
          <option value="3">⭐⭐⭐ (3)</option>
          <option value="2">⭐⭐ (2)</option>
          <option value="1">⭐ (1)</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => dispatch(setFilters({ status: e.target.value, page: 1 }))}
          className="bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2 text-sm text-[#EDEFF4] focus:outline-none focus:border-[#C9A15C]/50"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Hidden">Hidden</option>
        </select>
        <select
          value={filters.sort}
          onChange={(e) => dispatch(setFilters({ sort: e.target.value, page: 1 }))}
          className="bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2 text-sm text-[#EDEFF4] focus:outline-none focus:border-[#C9A15C]/50"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="rating-desc">Highest Rating</option>
          <option value="rating-asc">Lowest Rating</option>
        </select>
      </div>

      {listStatus === "loading" ? (
        <div className="flex items-center justify-center py-16">
          <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-[#161B2C] border border-[#2A3142] rounded-md py-16 text-center text-[#565F78]">
          No Reviews Found
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-[#161B2C] border border-[#2A3142] rounded-md overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-[#2A3142] bg-[#0F1320]/50">
                <tr>
                  {["User", "Product", "Rating", "Review", "Status", "Date"].map((h) => (
                    <th key={h} className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr
                    key={r._id}
                    onClick={() => navigate(`/reviews/${r._id}`)}
                    className="border-b border-[#2A3142]/60 last:border-0 hover:bg-[#2A3142]/20 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4 text-[#EDEFF4] font-medium">{r.userName || "Unknown"}</td>
                    <td className="px-5 py-4 text-[#8991A8]">{r.productName || "Deleted Product"}</td>
                    <td className="px-5 py-4"><StarRating rating={r.rating} /></td>
                    <td className="px-5 py-4 text-[#8991A8] max-w-xs truncate">{r.review}</td>
                    <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-5 py-4 text-[#8991A8] whitespace-nowrap">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="bg-[#161B2C] border border-[#2A3142] rounded-md p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#EDEFF4] font-medium text-sm">{r.userName || "Unknown"}</p>
                    <p className="text-xs text-[#8991A8]">{r.productName}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <StarRating rating={r.rating} />
                <p className="text-sm text-[#8991A8] line-clamp-2">{r.review}</p>
                <div className="flex justify-between items-center pt-2 border-t border-[#2A3142]/60">
                  <span className="text-xs text-[#565F78]">{formatDate(r.createdAt)}</span>
                  <button
                    onClick={() => navigate(`/reviews/${r._id}`)}
                    className="text-xs text-[#C9A15C] hover:text-[#D9B36E] transition"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-6">
        <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={(page) => dispatch(setFilters({ page }))} />
      </div>
    </div>
  );
};

export default ReviewsPage;