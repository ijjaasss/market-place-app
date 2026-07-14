import Category from "../../models/Category.js";
import Product from "../../models/Product.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isValid } from "../../utils/validation.js";

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!isValid(name)) {
    return next(new AppError("Category name is required", 400));
  }

  const exists = await Category.findOne({
    name: { $regex: `^${name.trim()}$`, $options: "i" },
  });

  if (exists) {
    return next(new AppError("Category already exists", 400));
  }

  const image = req.file?.path || "";

  if (!image) {
    return next(new AppError("Category image is required", 400));
  }

  const category = await Category.create({
    name: name.trim(),
    image,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});




export const getCategories = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, status } = req.query;

  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (status === "active") filter.isActive = true;
  if (status === "inactive") filter.isActive = false;

  const [categories, totalRecords, totalCount, activeCount, inactiveCount] = await Promise.all([
    Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Category.countDocuments(filter),
    Category.countDocuments({}),
    Category.countDocuments({ isActive: true }),
    Category.countDocuments({ isActive: false }),
  ]);

  res.status(200).json({
    success: true,
    cards: {
      totalCategories: totalCount,
      activeCategories: activeCount,
      inactiveCategories: inactiveCount,
    },
    categories,
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    limit,
  });
});


export const getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  const productCount = await Product.countDocuments({
    category: category._id,
    isDeleted: false,
  });

  res.status(200).json({
    success: true,
    category,
    productCount,
  });
});




export const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  const { name } = req.body;

  if (name && name !== category.name) {
    const existing = await Category.findOne({
  name: {
    $regex: `^${name.trim()}$`,
    $options: "i",
  },
  _id: { $ne: category._id },
});
    if (existing) {
      return next(new AppError("Category name already in use", 400));
    }
    category.name = name.trim();
  }

  if (req.file?.path) {
    category.image = req.file.path;
  }

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
});


export const toggleCategoryStatus = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  // allow explicit isActive in body, otherwise just flip the current value
  category.isActive =
    typeof req.body.isActive === "boolean" ? req.body.isActive : !category.isActive;

  await category.save();

  res.status(200).json({
    success: true,
    message: `Category ${category.isActive ? "enabled" : "disabled"} successfully`,
    category,
  });
});


