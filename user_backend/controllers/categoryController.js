import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValid } from "../utils/validation.js";


export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({
    name: 1,
  });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

export const getProductsByCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
if(!isValid(id)){
  return next(new AppError("id is required",400))
}
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const { search, sort } = req.query;

  const filter = {
    category: id,
    status: "Approved",
    isDeleted: false,
  };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "price-low": { price: 1 },
    "price-high": { price: -1 },
    "name-asc": { name: 1 },
  };

  const sortBy = sortOptions[sort] || sortOptions.newest;

  const [products, totalRecords] = await Promise.all([
    Product.find(filter)
      .populate("category", "name")
      .populate("seller", "shopname")
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),

    Product.countDocuments(filter),
  ]);
  let wishlistIds = new Set();

  if (req.user) {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).select(
      "products"
    );

    if (wishlist) {
      wishlistIds = new Set(
        wishlist.products.map((id) => id.toString())
      );
    }
  }

  const productsWithWishlist = products.map((product) => ({
    ...product,
    isWishlisted: wishlistIds.has(product._id.toString()),
  }));
  console.log(wishlistIds)
  res.status(200).json({
    success: true,
    products:productsWithWishlist,
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    limit,
  });
});