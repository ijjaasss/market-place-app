import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValid } from "../utils/validation.js";

// @desc    Create a review for a product (only if the user has received it)
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res, next) => {
  const { product: productId, rating, review } = req.body;

  if (!isValid(productId, rating)) {
    return next(new AppError("Product id and rating are required", 400));
  }

  if (rating < 1 || rating > 5) {
    return next(new AppError("Rating must be between 1 and 5", 400));
  }

  const product = await Product.findOne({
    _id: productId,
    status: "Approved",
    isDeleted: false,
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const hasPurchased = await Order.findOne({
    user: req.user._id,
    orderStatus: "Delivered",
    "items.product": productId,
  });

  if (!hasPurchased) {
    return next(
      new AppError("You can only review products you have received", 403)
    );
  }

  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingReview) {
    return next(new AppError("You have already reviewed this product", 400));
  }

  const newReview = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    review,
  });

  res.status(201).json({
    success: true,
    message: "Review added successfully.",
    review: newReview,
  });
});


export const getProductReviews = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { page = 1, limit = 10, sort = "newest" } = req.query;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(new AppError("Invalid product id", 400));
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    highest: { rating: -1 },
    lowest: { rating: 1 },
  };

  const sortBy = sortOptions[sort] || sortOptions.newest;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  const productObjectId = new mongoose.Types.ObjectId(productId);

  const [reviews, total, ratingStats, ratingCounts] = await Promise.all([
    Review.find({ product: productId ,status:"Active"})
      .populate("user", "name")
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum),
    Review.countDocuments({ product: productId }),
    Review.aggregate([
      { $match: { product: productObjectId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]),
    Review.aggregate([
      { $match: { product: productObjectId } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]),
  ]);

  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ratingCounts.forEach(({ _id, count }) => {
    ratingBreakdown[_id] = count;
  });

  res.status(200).json({
    success: true,
    summary: {
      averageRating: Number((ratingStats[0]?.avgRating || 0).toFixed(1)),
      totalReviews: total,
      ratingBreakdown,
    },
    reviews,
    currentPage: pageNum,
    totalPages: Math.ceil(total / limitNum),
  });
});





export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const existingReview = await Review.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!existingReview) {
    return next(new AppError("Review not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Review deleted successfully.",
  });
});