import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchWithdrawals,
  setFilters,
} from "../features/withdrawals/withdrawalsSlice";
import WithdrawalSummaryCards from "../components/withdrawals/WithdrawalSummaryCards";
import WithdrawalFilters from "../components/withdrawals/WithdrawalFilters";
import WithdrawalsTable from "../components/withdrawals/WithdrawalsTable";
import Pagination from "../components/shared/Pagination";

const Withdrawals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { withdrawals, totalPages, filters, listStatus, summary } =
    useSelector((state) => state.withdrawals);

  const [searchInput, setSearchInput] = useState(filters.search);

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
    dispatch(fetchWithdrawals(filters));
  }, [dispatch, filters]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#8991A8] uppercase mb-1">
          Payouts
        </p>
        <h1 className="text-lg font-semibold text-[#EDEFF4]">
          Withdrawal Management
        </h1>
      </div>

      <WithdrawalSummaryCards summary={summary} />

      <WithdrawalFilters
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
          <WithdrawalsTable
            withdrawals={withdrawals}
            onView={(w) => navigate(`/withdrawals/${w._id}`)}
          />
        )}
      </div>

      <Pagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setFilters({ page }))}
      />
    </div>
  );
};

export default Withdrawals;