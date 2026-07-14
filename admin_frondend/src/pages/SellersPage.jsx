import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchSellers,
  fetchSellerSummary,
  fetchSellerById,
  updateSellerStatus,
  toggleSellerBlock,
  setFilters,
  clearSelectedSeller,
} from "../features/sellers/sellersSlice";
import SellerSummaryCards from "../components/sellers/SellerSummaryCards";
import SellerFilters from "../components/sellers/SellerFilters";
import SellersTable from "../components/sellers/SellersTable.jsx";
import SellerViewModal from "../components/sellers/SellerViewModal";
import ConfirmDialog from "../components/sellers/ConfirmDialog";
import Pagination from "../components/sellers/Pagination";

const CONFIRM_CONFIG = {
  approve: {
    title: "Approve Seller?",
    confirmLabel: "Approve",
    tone: "positive",
    showReason: false,
    status: "Approved",
  },
  reject: {
    title: "Reject Seller?",
    confirmLabel: "Reject",
    tone: "danger",
    showReason: true,
    status: "Rejected",
  },
  block: {
    title: "Block Seller?",
    confirmLabel: "Block",
    tone: "danger",
    showReason: false,
  },
  unblock: {
    title: "Unblock Seller?",
    confirmLabel: "Unblock",
    tone: "positive",
    showReason: false,
  },
};

const SellersPage = () => {
  const dispatch = useDispatch();
  const {
    sellers,
    totalPages,
    filters,
    listStatus,
    summary,
    selectedSeller,
    detailStatus,
    actionStatus,
  } = useSelector((state) => state.sellers);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { type, seller }


  // initial summary load (independent of table pagination/filters)
  useEffect(() => {
    dispatch(fetchSellerSummary());
  }, [dispatch]);

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

  // fetch the table whenever any filter changes
  useEffect(() => {
    dispatch(fetchSellers(filters));
  }, [dispatch, filters]);

  const handleView = (seller) => {
    setViewModalOpen(true);
    dispatch(fetchSellerById(seller._id));
  };

  const handleCloseView = () => {
    setViewModalOpen(false);
    dispatch(clearSelectedSeller());
  };

  const openConfirm = (type, seller) => {

    setConfirmAction({ type, seller });
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { type, seller } = confirmAction;
    const config = CONFIRM_CONFIG[type];

    const result =
      type === "block" || type === "unblock"
        ? await dispatch(toggleSellerBlock(seller._id))
        : await dispatch(
            updateSellerStatus({ id: seller._id, status: config.status })
          );

    if (result.meta.requestStatus === "fulfilled") {
      toast.success(`${seller.shopname}: ${config.title.replace("?", "")}d.`);
      setConfirmAction(null);
    } else {
      toast.error(result.payload || "Action failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#8991A8] uppercase mb-1">
          Seller Management
        </p>
        <h1 className="text-lg font-semibold text-[#EDEFF4]">Sellers</h1>
      </div>

      <SellerSummaryCards summary={summary} />

      <SellerFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        status={filters.status}
        onStatusChange={(status) => dispatch(setFilters({ status, page: 1 }))}
        sort={filters.sort}
        onSortChange={(sort) => dispatch(setFilters({ sort, page: 1 }))}
        limit={filters.limit}
        onLimitChange={(limit) => dispatch(setFilters({ limit, page: 1 }))}
      />

      <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5">
        {listStatus === "loading" ? (
          <div className="flex items-center justify-center py-16">
            <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
          </div>
        ) : (
          <SellersTable
            sellers={sellers}
            onView={handleView}
            onApprove={(seller) => openConfirm("approve", seller)}
            onReject={(seller) => openConfirm("reject", seller)}
            onBlockToggle={(seller) =>
              openConfirm(seller.isBlocked ? "unblock" : "block", seller)
            }
          />
        )}
      </div>

      <Pagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setFilters({ page }))}
      />

      {viewModalOpen && (
        <SellerViewModal
          seller={selectedSeller}
          loading={detailStatus === "loading"}
          onClose={handleCloseView}
          onApprove={() => openConfirm("approve", selectedSeller)}
          onReject={() => openConfirm("reject", selectedSeller)}
          onBlockToggle={() =>
            openConfirm(
              selectedSeller?.isBlocked ? "unblock" : "block",
              selectedSeller
            )
          }
        />
      )}

      {confirmAction && (
        <ConfirmDialog
          open={!!confirmAction}
          title={CONFIRM_CONFIG[confirmAction.type].title}
          description={`${confirmAction.seller.shopname} — ${confirmAction.seller.ownername}`}
          confirmLabel={CONFIRM_CONFIG[confirmAction.type].confirmLabel}
          tone={CONFIRM_CONFIG[confirmAction.type].tone}
        

          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
          loading={actionStatus === "loading"}
        />
      )}
    </div>
  );
};

export default SellersPage;