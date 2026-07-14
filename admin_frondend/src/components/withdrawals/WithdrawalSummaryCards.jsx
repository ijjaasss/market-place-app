const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const SummaryCard = ({ label, value, tone = "neutral" }) => {
  const tones = {
    neutral: "text-[#EDEFF4]",
    pending: "text-[#C9A15C]",
    approved: "text-[#5B8DEF]",
    paid: "text-[#4ADE80]",
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

const WithdrawalSummaryCards = ({ summary }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <SummaryCard label="Total Requests" value={summary.totalRequests} />
    <SummaryCard label="Pending" value={summary.pending} tone="pending" />
    <SummaryCard label="Approved" value={summary.approved} tone="approved" />
    <SummaryCard
      label="Total Paid"
      value={currency(summary.totalPaidAmount)}
      tone="paid"
    />
  </div>
);

export default WithdrawalSummaryCards;