import Review from "../../models/Review.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "rating-desc": { rating: -1 },
  "rating-asc": { rating: 1 },
};

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};


export const getReviews = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, rating, status, sort } = req.query;

  const matchStage = {};
  if (rating) matchStage.rating = parseInt(rating);
  if (status && ["Active", "Hidden"].includes(status)) matchStage.status = status;

  const sortBy = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { "productInfo.name": { $regex: search, $options: "i" } },
          { "userInfo.name": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  pipeline.push(
    { $sort: sortBy },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              rating: 1,
              review: 1,
              status: 1,
              createdAt: 1,
              productName: "$productInfo.name",
              userName: "$userInfo.name",
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    }
  );

  const { start, end } = getTodayRange();

  const [result, totalReviews, fiveStarCount, hiddenCount, todaysCount] = await Promise.all([
    Review.aggregate(pipeline),
    Review.countDocuments({}),
    Review.countDocuments({ rating: 5 }),
    Review.countDocuments({ status: "Hidden" }),
    Review.countDocuments({ createdAt: { $gte: start, $lte: end } }),
  ]);

  const reviews = result[0]?.data || [];
  const totalRecords = result[0]?.totalCount?.[0]?.count || 0;

  res.status(200).json({
    success: true,
    cards: {
      totalReviews,
      fiveStarReviews: fiveStarCount,
      hiddenReviews: hiddenCount,
      todaysReviews: todaysCount,
    },
    reviews,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    totalRecords,
    limit,
  });
});


export const getReviewById = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate("user", "name email profileImage")
    .populate("product", "name images");

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  res.status(200).json({ success: true, review });
});

export const hideReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  review.status = "Hidden";
  await review.save();

  res.status(200).json({ success: true, message: "Review hidden successfully", review });
});


export const unhideReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  review.status = "Active";
  await review.save();

  res.status(200).json({ success: true, message: "Review unhidden successfully", review });
});


export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  res.status(200).json({ success: true, message: "Review deleted successfully" });
});