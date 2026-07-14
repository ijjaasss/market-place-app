import mongoose from "mongoose";
import Review from "../../models/Review.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getSellerReviews = asyncHandler(async (req, res, next) => {
  const sellerId = new mongoose.Types.ObjectId(req.seller._id);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { search, rating, sort } = req.query;

  const statsPipeline = [
    {
      $lookup: {
        from: "products", 
        localField: "product",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    { $unwind: "$productDetails" },

    { $match: { "productDetails.seller": sellerId } }, 
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
        fiveStarReviews: { 
            $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } 
        },
        uniqueProducts: { $addToSet: "$product" } 
      }
    }
  ];

  const statsResult = await Review.aggregate(statsPipeline);
  const stats = statsResult[0] || {
    totalReviews: 0,
    averageRating: 0,
    fiveStarReviews: 0,
    uniqueProducts: []
  };

  const cards = {
    totalReviews: stats.totalReviews,
    averageRating: stats.averageRating ? Number(stats.averageRating.toFixed(1)) : 0,
    fiveStarReviews: stats.fiveStarReviews,
    productsWithReviews: stats.uniqueProducts.length || 0
  };


  const pipeline = [
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    { $unwind: "$productDetails" },
    { $match: { "productDetails.seller": sellerId } }, 
    {
      $lookup: {
        from: "users", 
        localField: "user",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    { $unwind: "$userDetails" }
  ];


  if (rating) {
    pipeline.push({ $match: { rating: parseInt(rating) } });
  }

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { "productDetails.name": { $regex: search, $options: "i" } },
          { "userDetails.name": { $regex: search, $options: "i" } }
        ]
      }
    });
  }


  let sortStage = { createdAt: -1 }; 
  if (sort === "oldest") sortStage = { createdAt: 1 };
  else if (sort === "highest-rating") sortStage = { rating: -1, createdAt: -1 };
  else if (sort === "lowest-rating") sortStage = { rating: 1, createdAt: -1 };
  pipeline.push({ $sort: sortStage });


  const countPipeline = [...pipeline, { $count: "total" }];
  const countResult = await Review.aggregate(countPipeline);
  const totalRecords = countResult[0]?.total || 0;

  // Apply Pagination and field projection for final output
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });
  pipeline.push({
    $project: {
      _id: 1,
      productName: "$productDetails.name",
      customerName: "$userDetails.name",
      rating: 1,
      review: 1,
      createdAt: 1
    }
  });

  const reviews = await Review.aggregate(pipeline);

  res.status(200).json({
    success: true,
    cards,
    reviews,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
  });
});

// 2. Get Single Review Details
export const getReviewDetails = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate({
      path: "product",
      select: "name images seller" // Pull product schema fields[cite: 23, 24]
    })
    .populate({
      path: "user",
      select: "name" // Pull user schema fields[cite: 24, 26]
    });

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  // Security Check: Ensure the seller owns the product this review is attached to[cite: 23, 24]
  if (review.product.seller.toString() !== req.seller._id.toString()) {
    return next(new AppError("You do not have permission to view this review", 403));
  }

  res.status(200).json({
    success: true,
    review: {
      _id: review._id,
      product: {
        name: review.product.name,
        images: review.product.images
      },
      customer: {
        name: review.user.name
      },
      rating: review.rating,
      review: review.review,
      createdAt: review.createdAt
    }
  });
});