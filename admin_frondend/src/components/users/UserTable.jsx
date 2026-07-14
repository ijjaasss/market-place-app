import { UserCircle2, Lock, Unlock } from "lucide-react";

const StatusBadge = ({ isBlocked }) => (
  <span
    className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${
      isBlocked
        ? "bg-[#E5484D]/10 text-[#E5484D] border-[#E5484D]/30"
        : "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30"
    }`}
  >
    {isBlocked ? "Blocked" : "Active"}
  </span>
);

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const UserTable = ({ users, onRowClick, onToggleStatus }) => {
  if (!users || users.length === 0) {
    return (
      <p className="text-sm text-[#565F78] py-12 text-center">
        No users match these filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2A3142] text-left">
            {["User", "Email", "Phone", "Joined", "Status", "Actions"].map(
              (h) => (
                <th
                  key={h}
                  className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-2 whitespace-nowrap"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              onClick={() => onRowClick(user)}
              className="border-b border-[#2A3142]/60 last:border-0 hover:bg-[#1A2030] transition-colors cursor-pointer"
            >
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover border border-[#2A3142]"
                    />
                  ) : (
                    <UserCircle2 size={28} className="text-[#565F78]" />
                  )}
                  <span className="text-[#EDEFF4] font-medium">
                    {user.name}
                  </span>
                </div>
              </td>
              <td className="px-5 py-3 text-[#8991A8]">{user.email}</td>
              <td className="px-5 py-3 text-[#8991A8] whitespace-nowrap">
                {user.phone}
              </td>
              <td className="px-5 py-3 text-[#8991A8] whitespace-nowrap">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-5 py-3">
                <StatusBadge isBlocked={user.isblocked} />
              </td>
              <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                {user.isblocked ? (
                  <button
                    onClick={() => onToggleStatus(user)}
                    className="p-1.5 rounded-md border border-[#4ADE80]/30 text-[#4ADE80] hover:bg-[#4ADE80]/10 transition"
                    title="Unblock"
                  >
                    <Unlock size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => onToggleStatus(user)}
                    className="p-1.5 rounded-md border border-[#E5484D]/30 text-[#E5484D] hover:bg-[#E5484D]/10 transition"
                    title="Block"
                  >
                    <Lock size={14} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;