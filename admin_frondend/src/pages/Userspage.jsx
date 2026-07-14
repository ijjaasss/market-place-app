import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchUsers,
  toggleUserStatus,
  setFilters,
} from "../features/users/usersSlice";
import UserSummaryCards from "../components/users/UserSummaryCards";
import UserFilters from "../components/users/UserFilters";
import UserTable from "../components/users/UserTable";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import Pagination from "../components/shared/Pagination";

const UsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, totalPages, filters, listStatus, summary, actionStatus } =
    useSelector((state) => state.users);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [statusConfirm, setStatusConfirm] = useState(null); // user

  // debounce search typing into the redux filter
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== filters.search) {
        dispatch(setFilters({ search: searchInput, page: 1 }));
      }
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  const handleConfirmStatus = async () => {
    const nextIsBlocked = !statusConfirm.isblocked;
    const result = await dispatch(
      toggleUserStatus({ id: statusConfirm._id, isBlocked: nextIsBlocked })
    );
    if (toggleUserStatus.fulfilled.match(result)) {
      toast.success(
        `${statusConfirm.name} ${nextIsBlocked ? "blocked" : "unblocked"}.`
      );
      setStatusConfirm(null);
    } else {
      toast.error(result.payload || "Failed to update status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#8991A8] uppercase mb-1">
          Accounts
        </p>
        <h1 className="text-lg font-semibold text-[#EDEFF4]">
          Users Management
        </h1>
      </div>

      <UserSummaryCards summary={summary} />

      <UserFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        status={filters.status}
        onStatusChange={(status) => dispatch(setFilters({ status, page: 1 }))}
        sort={filters.sort}
        onSortChange={(sort) => dispatch(setFilters({ sort, page: 1 }))}
      />

      <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5">
        {listStatus === "loading" ? (
          <div className="flex items-center justify-center py-16">
            <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
          </div>
        ) : (
          <UserTable
            users={users}
            onRowClick={(user) => navigate(`/users/${user._id}`)}
            onToggleStatus={(user) => setStatusConfirm(user)}
          />
        )}
      </div>

      <Pagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setFilters({ page }))}
      />

      {statusConfirm && (
        <ConfirmDialog
          open={!!statusConfirm}
          title={
            statusConfirm.isblocked ? "Unblock this user?" : "Block this user?"
          }
          description={`${statusConfirm.name} — ${statusConfirm.email}`}
          confirmLabel={statusConfirm.isblocked ? "Unblock" : "Block"}
          tone={statusConfirm.isblocked ? "positive" : "danger"}
          onConfirm={handleConfirmStatus}
          onCancel={() => setStatusConfirm(null)}
          loading={actionStatus === "loading"}
        />
      )}
    </div>
  );
};

export default UsersPage;