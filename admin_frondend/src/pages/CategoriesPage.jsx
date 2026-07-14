import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  setFilters,
  clearSelectedCategory,
} from "../features/categories/categoriesSlice";
import CategorySummaryCards from "../components/categories/CategorySummaryCards";
import CategoryFilters from "../components/categories/CategoryFilters";
import CategoryTable from "../components/categories/CategoryTable";
import CategoryFormModal from "../components/categories/CategoryFormModal";
import CategoryViewModal from "../components/categories/CategoryViewModal.jsx";
import ConfirmDialog from "../components/shared/ConfirmDialog.jsx";
import Pagination from "../components/shared/Pagination.jsx";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const {
    categories,
    totalPages,
    filters,
    listStatus,
    summary,
    selectedCategory,
    productCount,
    detailStatus,
    actionStatus,
  } = useSelector((state) => state.categories);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [formModal, setFormModal] = useState(null); // { mode: 'create' | 'edit', category? }
  const [viewOpen, setViewOpen] = useState(false);
  const [statusConfirm, setStatusConfirm] = useState(null); // category

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
    dispatch(fetchCategories(filters));
  }, [dispatch, filters]);

  const handleView = (category) => {
    setViewOpen(true);
    dispatch(fetchCategoryById(category._id));
  };

  const handleCloseView = () => {
    setViewOpen(false);
    dispatch(clearSelectedCategory());
  };

  const handleFormSubmit = async (formData) => {
    const result =
      formModal.mode === "edit"
        ? await dispatch(
            updateCategory({ id: formModal.category._id, formData })
          )
        : await dispatch(createCategory(formData));

    const thunk = formModal.mode === "edit" ? updateCategory : createCategory;
    if (thunk.fulfilled.match(result)) {
      toast.success(
        formModal.mode === "edit"
          ? "Category updated successfully."
          : "Category created successfully."
      );
      setFormModal(null);
    } else {
      toast.error(result.payload || "Something went wrong");
    }
  };

  const handleConfirmStatus = async () => {
    const nextIsActive = !statusConfirm.isActive;
    const result = await dispatch(
      toggleCategoryStatus({ id: statusConfirm._id, isActive: nextIsActive })
    );
    if (toggleCategoryStatus.fulfilled.match(result)) {
      toast.success(
        `${statusConfirm.name} ${nextIsActive ? "enabled" : "disabled"}.`
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
          Catalog
        </p>
        <h1 className="text-lg font-semibold text-[#EDEFF4]">
          Category Management
        </h1>
      </div>

      <CategorySummaryCards summary={summary} />

      <CategoryFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        status={filters.status}
        onStatusChange={(status) => dispatch(setFilters({ status, page: 1 }))}
        onAddClick={() => setFormModal({ mode: "create" })}
      />

      <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5">
        {listStatus === "loading" ? (
          <div className="flex items-center justify-center py-16">
            <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
          </div>
        ) : (
          <CategoryTable
            categories={categories}
            onView={handleView}
            onEdit={(category) => setFormModal({ mode: "edit", category })}
            onToggleStatus={(category) => setStatusConfirm(category)}
          />
        )}
      </div>

      <Pagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setFilters({ page }))}
      />

      <CategoryFormModal
        open={!!formModal}
        mode={formModal?.mode}
        initialCategory={formModal?.category}
        onClose={() => setFormModal(null)}
        onSubmit={handleFormSubmit}
        loading={actionStatus === "loading"}
      />

      {viewOpen && (
        <CategoryViewModal
          category={selectedCategory}
          productCount={productCount}
          loading={detailStatus === "loading"}
          onClose={handleCloseView}
        />
      )}

      {statusConfirm && (
        <ConfirmDialog
          open={!!statusConfirm}
          title={
            statusConfirm.isActive
              ? "Disable this category?"
              : "Enable this category?"
          }
          description={`Are you sure you want to ${
            statusConfirm.isActive ? "disable" : "enable"
          } "${statusConfirm.name}"?`}
          confirmLabel={statusConfirm.isActive ? "Disable" : "Enable"}
          tone={statusConfirm.isActive ? "danger" : "positive"}
          onConfirm={handleConfirmStatus}
          onCancel={() => setStatusConfirm(null)}
          loading={actionStatus === "loading"}
        />
      )}
    </div>
  );
};

export default CategoriesPage;