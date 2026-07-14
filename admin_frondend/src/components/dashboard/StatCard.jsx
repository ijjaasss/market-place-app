const StatCard = ({ label, value, icon: Icon, accent = false, hint }) => {
  return (
    <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5 flex items-start justify-between">
      <div>
        <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-2">
          {label}
        </p>
        <p className="text-2xl font-semibold text-[#EDEFF4] tabular-nums">
          {value}
        </p>
        {hint && <p className="text-xs text-[#565F78] mt-1">{hint}</p>}
      </div>
      {Icon && (
        <div
          className={`h-9 w-9 rounded-md flex items-center justify-center border ${
            accent
              ? "bg-[#C9A15C]/10 border-[#C9A15C]/30 text-[#C9A15C]"
              : "bg-[#0F1320] border-[#2A3142] text-[#8991A8]"
          }`}
        >
          <Icon size={16} />
        </div>
      )}
    </div>
  );
};

export default StatCard;