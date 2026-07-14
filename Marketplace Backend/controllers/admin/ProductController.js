import Product from "../../models/Product.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "name-asc": { name: 1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
};
export const getAdminProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, status, category, sort } = req.query;

  const filter = { isDeleted: false };

  if (search) {
  filter.$or = [
    { name: { $regex: search, $options: "i" } },
    { brand: { $regex: search, $options: "i" } },
  ];
}

  if (status && ["Pending", "Approved", "Rejected"].includes(status)) {
    filter.status = status;
  }

  if (category) {
    filter.category = category;
  }

  const sortBy = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;

  const [products, totalRecords, totalCount, pendingCount, approvedCount, rejectedCount] =
    await Promise.all([
      Product.find(filter)
        .populate("seller", "shopname ownername")
        .populate("category", "name")
        .sort(sortBy)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
      Product.countDocuments({ isDeleted: false }),
      Product.countDocuments({ isDeleted: false, status: "Pending" }),
      Product.countDocuments({ isDeleted: false, status: "Approved" }),
      Product.countDocuments({ isDeleted: false, status: "Rejected" }),
    ]);

  res.status(200).json({
    success: true,
    cards: {
      totalProducts: totalCount,
      pendingProducts: pendingCount,
      approvedProducts: approvedCount,
      rejectedProducts: rejectedCount,
    },
    products,
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    limit,
  });
});


export const getAdminProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id, isDeleted: false })
    .populate("seller", "shopname ownername email phone")
    .populate("category", "name");

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({ success: true, product });
});


export const updateProductStatus = asyncHandler(async (req, res, next) => {
  const { status, rejectReason } = req.body;
console.log( status, rejectReason );

  if (!["Approved", "Rejected"].includes(status)) {
    return next(new AppError("Status must be either 'Approved' or 'Rejected'", 400));
  }

  if (status === "Rejected" && !rejectReason?.trim()) {
    return next(new AppError("Reject reason is required when rejecting a product", 400));
  }

  const product = await Product.findOne({ _id: req.params.id, isDeleted: false });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  product.status = status;
  product.rejectReason = status === "Rejected" ? rejectReason.trim() : "";

  await product.save();

  res.status(200).json({
    success: true,
    message: `Product ${status.toLowerCase()} successfully`,
    product,
  });
});


export const deleteAdminProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id, isDeleted: false });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  product.isDeleted = true;
  await product.save();

  res.status(200).json({ success: true, message: "Product deleted successfully" });
});






