import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";
import {
  fetchProducts,
  fetchProductById,
  updateProductStatus,
  deleteProduct,
  setFilters,
  clearSelectedProduct,
} from "../features/products/productsSlice";
import ProductSummaryCards from "../components/products/ProductSummaryCards";
import ProductFilters from "../components/products/ProductFilters";
import ProductTable from "../components/products/ProductTable";
import ProductViewModal from "../components/products/ProductViewModal";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import Pagination from "../components/shared/Pagination";

const CONFIRM_CONFIG = {
  approve: {
    title: "Approve Product?",
    confirmLabel: "Approve",
    tone: "positive",
    showReason: false,
  },
  reject: {
    title: "Reject Product?",
    confirmLabel: "Reject",
    tone: "danger",
    showReason: true,
  },
  delete: {
    title: "Delete Product?",
    confirmLabel: "Delete",
    tone: "danger",
    showReason: false,
  },
};

const ProductsPage = () => {
  const dispatch = useDispatch();
  const {
    products,
    totalPages,
    filters,
    listStatus,
    summary,
    selectedProduct,
    detailStatus,
    actionStatus,
  } = useSelector((state) => state.products);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { type, product }
  const [reason, setReason] = useState("");

  // category dropdown options — pulled once, independent of the categories page's own pagination
  useEffect(() => {
    api
      .get("/admin/categories", { params: { limit: 1000, status: "active" } })
      .then((res) => setCategoryOptions(res.data.categories || []))
      .catch(() => setCategoryOptions([]));
  }, []);

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
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleView = (product) => {
    setViewModalOpen(true);
    dispatch(fetchProductById(product._id));
  };

  const handleCloseView = () => {
    setViewModalOpen(false);
    dispatch(clearSelectedProduct());
  };

  const openConfirm = (type, product) => {
    setReason("");
    setConfirmAction({ type, product });
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { type, product } = confirmAction;

    let result;
    if (type === "delete") {
      result = await dispatch(deleteProduct(product._id));
    } else if (type === "approve") {
      result = await dispatch(
        updateProductStatus({ id: product._id, status: "Approved" })
      );
    } else {
      result = await dispatch(
        updateProductStatus({
          id: product._id,
          status: "Rejected",
          rejectReason: reason,
        })
      );
    }

    if (result.meta.requestStatus === "fulfilled") {
      toast.success(
        `${product.name}: ${CONFIRM_CONFIG[type].title.replace("?", "")}d.`
      );
      setConfirmAction(null);
      if (type === "delete" && viewModalOpen) handleCloseView();
    } else {
      toast.error(result.payload || "Action failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#8991A8] uppercase mb-1">
          Catalog
        </p>
        <h1 className="text-lg font-semibold text-[#EDEFF4]">
          Product Management
        </h1>
      </div>

      <ProductSummaryCards summary={summary} />

      <ProductFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        status={filters.status}
        onStatusChange={(status) => dispatch(setFilters({ status, page: 1 }))}
        category={filters.category}
        onCategoryChange={(category) =>
          dispatch(setFilters({ category, page: 1 }))
        }
        categoryOptions={categoryOptions}
        sort={filters.sort}
        onSortChange={(sort) => dispatch(setFilters({ sort, page: 1 }))}
      />

      <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5">
        {listStatus === "loading" ? (
          <div className="flex items-center justify-center py-16">
            <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
          </div>
        ) : (
          <ProductTable
            products={products}
            onView={handleView}
            onApprove={(product) => openConfirm("approve", product)}
            onReject={(product) => openConfirm("reject", product)}
            onDelete={(product) => openConfirm("delete", product)}
          />
        )}
      </div>

      <Pagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setFilters({ page }))}
      />

      {viewModalOpen && (
        <ProductViewModal
          product={selectedProduct}
          loading={detailStatus === "loading"}
          onClose={handleCloseView}
          onApprove={() => openConfirm("approve", selectedProduct)}
          onReject={() => openConfirm("reject", selectedProduct)}
          onDelete={() => openConfirm("delete", selectedProduct)}
        />
      )}

      {confirmAction && (
        <ConfirmDialog
          open={!!confirmAction}
          title={CONFIRM_CONFIG[confirmAction.type].title}
          description={confirmAction.product.name}
          confirmLabel={CONFIRM_CONFIG[confirmAction.type].confirmLabel}
          tone={CONFIRM_CONFIG[confirmAction.type].tone}
          showReason={CONFIRM_CONFIG[confirmAction.type].showReason}
          reason={reason}
          onReasonChange={setReason}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
          loading={actionStatus === "loading"}
        />
      )}
    </div>
  );
};

export default ProductsPage;