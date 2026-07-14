import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ArrowLeft, UserCircle2, EyeOff, Eye, Trash2, Package } from "lucide-react";
import { fetchReviewById, toggleReviewVisibility, deleteReview, clearSelectedReview } from "../features/reviews/reviewsSlice";
import ConfirmDialog from "../components/shared/ConfirmDialog"; // Assuming you have this

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-[#C9A15C] fill-[#C9A15C]" : "text-[#565F78] fill-transparent"}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
};

const ReviewDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedReview: review, detailStatus, actionStatus } = useSelector((state) => state.reviews);

  const [confirmState, setConfirmState] = useState(null); // 'hide', 'unhide', 'delete'

  useEffect(() => {
    dispatch(fetchReviewById(id));
    return () => dispatch(clearSelectedReview());
  }, [dispatch, id]);

  const handleConfirm = async () => {
    if (!confirmState) return;

    if (confirmState === "delete") {
      const result = await dispatch(deleteReview(id));
      if (deleteReview.fulfilled.match(result)) {
        toast.success("Review deleted permanently.");
        navigate("/reviews");
      } else {
        toast.error(result.payload || "Failed to delete review");
      }
    } else {
      const result = await dispatch(toggleReviewVisibility({ id, action: confirmState }));
      if (toggleReviewVisibility.fulfilled.match(result)) {
        toast.success(`Review is now ${confirmState === "hide" ? "hidden" : "active"}.`);
        setConfirmState(null);
      } else {
        toast.error(result.payload || "Failed to update review status");
      }
    }
  };

  if (detailStatus === "loading" || !review) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
      </div>
    );
  }

  const isHidden = review.status === "Hidden";

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/reviews" className="inline-flex items-center gap-2 text-sm text-[#8991A8] hover:text-[#EDEFF4] transition mb-6">
        <ArrowLeft size={15} /> Back to Reviews
      </Link>

      <div className="mb-6">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#8991A8] uppercase mb-1">Details</p>
        <h1 className="text-lg font-semibold text-[#EDEFF4]">Review Assessment</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Left Column: Entities */}
        <div className="space-y-6">
          {/* User Block */}
          <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5">
            <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-4">Author</p>
            <div className="flex items-center gap-3">
              {review.user?.profileImage ? (
                <img src={review.user.profileImage} alt="User" className="h-12 w-12 rounded-full border border-[#2A3142] object-cover" />
              ) : (
                <UserCircle2 size={48} className="text-[#565F78]" />
              )}
              <div>
                <p className="text-[#EDEFF4] font-medium text-sm">{review.user?.name || "Unknown User"}</p>
                <p className="text-[#8991A8] text-xs">{review.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Product Block */}
          <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5">
             <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-4">Product</p>
            <div className="flex items-center gap-3">
              {review.product?.images?.[0] ? (
                <img src={review.product.images[0]} alt="Product" className="h-12 w-12 rounded border border-[#2A3142] object-cover" />
              ) : (
                <div className="h-12 w-12 rounded border border-[#2A3142] bg-[#0F1320] flex items-center justify-center">
                  <Package size={20} className="text-[#565F78]" />
                </div>
              )}
              <p className="text-[#EDEFF4] font-medium text-sm line-clamp-2">{review.product?.name || "Deleted Product"}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Review Content & Actions */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-6 relative">
            
            {/* Status Badge Top Right */}
            <div className="absolute top-6 right-6">
              <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${
                  isHidden ? "bg-[#E5484D]/10 text-[#E5484D] border-[#E5484D]/30" : "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30"
                }`}>
                {review.status}
              </span>
            </div>

            <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-4">Rating & Feedback</p>
            
            <div className="mb-4">
              <StarRating rating={review.rating} />
            </div>

            <div className="bg-[#0F1320] border border-[#2A3142] rounded-md p-4 mb-4">
               <p className="text-[#EDEFF4] text-sm whitespace-pre-wrap leading-relaxed">
                {review.review || "No written feedback provided."}
               </p>
            </div>

            <p className="text-xs text-[#565F78]">Posted on {formatDate(review.createdAt)}</p>

            <div className="h-px bg-[#2A3142] my-6" />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {isHidden ? (
                <button
                  onClick={() => setConfirmState("unhide")}
                  disabled={actionStatus === "loading"}
                  className="flex items-center gap-2 bg-[#161B2C] border border-[#4ADE80]/40 text-[#4ADE80] hover:bg-[#4ADE80]/10 text-sm font-medium px-4 py-2 rounded-md transition"
                >
                  <Eye size={16} /> Unhide Review
                </button>
              ) : (
                <button
                   onClick={() => setConfirmState("hide")}
                   disabled={actionStatus === "loading"}
                   className="flex items-center gap-2 bg-[#161B2C] border border-[#C9A15C]/40 text-[#C9A15C] hover:bg-[#C9A15C]/10 text-sm font-medium px-4 py-2 rounded-md transition"
                >
                  <EyeOff size={16} /> Hide Review
                </button>
              )}

              <button
                 onClick={() => setConfirmState("delete")}
                 disabled={actionStatus === "loading"}
                 className="flex items-center gap-2 bg-[#161B2C] border border-[#E5484D]/40 text-[#E5484D] hover:bg-[#E5484D]/10 text-sm font-medium px-4 py-2 rounded-md transition ml-auto"
              >
                <Trash2 size={16} /> Delete Permanently
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Reusing existing ConfirmDialog concept */}
      {confirmState && (
        <ConfirmDialog
          open={!!confirmState}
          title={
            confirmState === "hide" ? "Hide Review?" :
            confirmState === "unhide" ? "Unhide Review?" : "Delete Review?"
          }
          description={
            confirmState === "hide" ? "This review will no longer be visible to customers." :
            confirmState === "unhide" ? "This review will be public again." : "This action cannot be undone. Are you sure?"
          }
          confirmLabel={confirmState.charAt(0).toUpperCase() + confirmState.slice(1)}
          tone={confirmState === "unhide" ? "positive" : "danger"}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmState(null)}
          loading={actionStatus === "loading"}
        />
      )}

    </div>
  );
};

export default ReviewDetailPage;