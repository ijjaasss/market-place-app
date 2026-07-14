const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel,
  tone = "positive", // "positive" | "danger"
  showReason = false,
  reason = "",
  onReasonChange,
  onConfirm,
  onCancel,
  loading,
}) => {
  if (!open) return null;

  const confirmClasses =
    tone === "danger"
      ? "bg-[#E5484D] hover:bg-[#F16368] text-white"
      : "bg-[#4ADE80] hover:bg-[#5EE896] text-[#0F1320]";

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] px-4"
      onClick={onCancel}
    >
      <div
        className="bg-[#161B2C] border border-[#2A3142] rounded-md w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-[#EDEFF4] mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[#8991A8] mb-4">{description}</p>
        )}

        {showReason && (
          <div className="mb-4">
            <label className="block font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-2">
              Reason (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => onReasonChange?.(e.target.value)}
              rows={3}
              placeholder="Let the seller know why..."
              className="w-full bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2 text-sm text-[#EDEFF4] placeholder:text-[#565F78] focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50 resize-none"
            />
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-[#2A3142] hover:border-[#565F78] text-sm text-[#EDEFF4] rounded-md py-2.5 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold rounded-md py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed ${confirmClasses}`}
          >
            {loading && (
              <span className="h-4 w-4 rounded-full border-2 border-current/40 border-t-current animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;