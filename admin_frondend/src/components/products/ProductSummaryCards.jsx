const SummaryCard = ({ label, value, tone = "neutral" }) => {
  const tones = {
    neutral: "text-[#EDEFF4]",
    pending: "text-[#C9A15C]",
    approved: "text-[#4ADE80]",
    rejected: "text-[#E5484D]",
  };
  return (
    <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5">
      <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-2">
        {label}
      </p>
      <p className={`text-2xl font-semibold tabular-nums ${tones[tone]}`}>
        {value}
      </p>
    </div>
  );
};

const ProductSummaryCards = ({ summary }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <SummaryCard label="Total Products" value={summary.totalProducts} />
    <SummaryCard
      label="Pending Products"
      value={summary.pendingProducts}
      tone="pending"
    />
    <SummaryCard
      label="Approved Products"
      value={summary.approvedProducts}
      tone="approved"
    />
    <SummaryCard
      label="Rejected Products"
      value={summary.rejectedProducts}
      tone="rejected"
    />
  </div>
);

export default ProductSummaryCards;