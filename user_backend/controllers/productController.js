import Product from "../models/Product.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Seller from "../models/Seller.js"
import Wishlist from "../models/Wishlist.js";

export const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {
    status: "Approved",
    isDeleted: false,
  };

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ name: regex }, { brand: regex }, { description: regex }];
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    priceLowToHigh: { price: 1 },
    priceHighToLow: { price: -1 },
  };

  const sortBy = sortOptions[sort] || sortOptions.newest;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name")
      .populate("seller", "shopname")
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum)
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
  res.status(200).json({
    success: true,
    count: productsWithWishlist.length,
    total,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    data: productsWithWishlist,
  });
});

// @desc    Get single product details with seller, category, related products
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    _id: id,
    status: "Approved",
    isDeleted: false,
  })
    .populate("category", "name image")
    .populate("seller", "shopname logo city")
    .lean();

  if (!product) {
    return next(new AppError("Product not found", 404));
  }
    product.isWishlisted = false;
  
    
    if (req.user) {
    const wishlist = await Wishlist.findOne({ user: req.user._id });


    if (
      wishlist &&
      wishlist.products.some(
        (productId) => productId.toString() === product._id.toString()
      )
    ) {
   
      product.isWishlisted = true;
    }
  }

  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    status: "Approved",
    isDeleted: false,
  })
    .limit(4)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      product,
      relatedProducts,
    },
  });
});