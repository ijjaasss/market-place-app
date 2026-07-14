import Category from "../../models/Category.js";
import Product from "../../models/Product.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isValid } from "../../utils/validation.js";
const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "name-asc": { name: 1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
};

export const getSellerProducts = asyncHandler(async (req, res, next) => {
  const sellerId = req.seller._id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, status, sort } = req.query;

  const filter = { seller: sellerId, isDeleted: false };

  if (search) {
    filter.$text = { $search: search };
  }

  if (status && ["Pending", "Approved", "Rejected"].includes(status)) {
    filter.status = status;
  }

  const sortBy = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;

  const [products, totalRecords, totalCount, approvedCount, pendingCount, rejectedCount] =
    await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .sort(sortBy)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
      Product.countDocuments({ seller: sellerId, isDeleted: false }),
      Product.countDocuments({ seller: sellerId, isDeleted: false, status: "Approved" }),
      Product.countDocuments({ seller: sellerId, isDeleted: false, status: "Pending" }),
      Product.countDocuments({ seller: sellerId, isDeleted: false, status: "Rejected" }),
    ]);

  res.status(200).json({
    success: true,
    cards: {
      totalProducts: totalCount,
      approvedProducts: approvedCount,
      pendingProducts: pendingCount,
      rejectedProducts: rejectedCount,
    },
    products,
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    limit,
  });
});


export const getSellerProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.params.id,
    seller: req.seller._id,
    isDeleted: false,
  }).populate("category", "name");

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({ success: true, product });
});
export const createSellerProduct = asyncHandler(async (req, res, next) => {
  const { name, description, category, brand, price, stock } = req.body;

  if (!isValid(name, category, price, stock)) {
    return next(new AppError("Name, category, price and stock are required", 400));
  }

  const categoryExists = await Category.findOne({ _id: category, isActive: true });
  if (!categoryExists) {
    return next(new AppError("Invalid category selected", 400));
  }

  const images = req.files?.map((file) => file.path) || [];
  if (images.length === 0) {
    return next(new AppError("At least one product image is required", 400));
  }

  const product = await Product.create({
    seller: req.seller._id,
    category,
    name,
    description,
    brand,
    price,
    stock,
    images,
   
  });

  res.status(201).json({
    success: true,
    message: "Product submitted. Waiting for admin approval.",
    product,
  });
});


export const updateSellerProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.params.id,
    seller: req.seller._id,
    isDeleted: false,
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const { name, description, category, brand, price, stock } = req.body;

  if (category) {
    const categoryExists = await Category.findOne({ _id: category, isActive: true });
    if (!categoryExists) {
      return next(new AppError("Invalid category selected", 400));
    }
    product.category = category;
  }

  if (name) product.name = name;
  if (description !== undefined) product.description = description;
  if (brand !== undefined) product.brand = brand;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;

  const newImages = req.files?.map((file) => file.path) || [];
  if (newImages.length > 0) {
    product.images = newImages;
  }

  product.status = "Pending";
  product.rejectReason = "";

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated. Waiting for admin approval.",
    product,
  });
});


export const deleteSellerProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.params.id,
    seller: req.seller._id,
    isDeleted: false,
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  product.isDeleted = true;
  await product.save();

  res.status(200).json({ success: true, message: "Product deleted successfully" });
});