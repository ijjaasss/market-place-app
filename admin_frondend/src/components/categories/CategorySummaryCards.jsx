const SummaryCard = ({ label, value, tone = "neutral" }) => {
  const tones = {
    neutral: "text-[#EDEFF4]",
    active: "text-[#4ADE80]",
    inactive: "text-[#8991A8]",
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

const CategorySummaryCards = ({ summary }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
    <SummaryCard label="Total Categories" value={summary.totalCategories} />
    <SummaryCard
      label="Active Categories"
      value={summary.activeCategories}
      tone="active"
    />
    <SummaryCard
      label="Inactive Categories"
      value={summary.inactiveCategories}
      tone="inactive"
    />
  </div>
);

export default CategorySummaryCards;