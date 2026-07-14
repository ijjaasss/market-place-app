const SummaryCard = ({ label, value, tone = "neutral" }) => {
  const tones = {
    neutral: "text-[#EDEFF4]",
    active: "text-[#4ADE80]",
    blocked: "text-[#E5484D]",
    new: "text-[#C9A15C]",
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

const UserSummaryCards = ({ summary }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <SummaryCard label="Total Users" value={summary.totalUsers} />
    <SummaryCard label="Active Users" value={summary.activeUsers} tone="active" />
    <SummaryCard
      label="Blocked Users"
      value={summary.blockedUsers}
      tone="blocked"
    />
    <SummaryCard label="New Users" value={summary.newUsers} tone="new" />
  </div>
);

export default UserSummaryCards;