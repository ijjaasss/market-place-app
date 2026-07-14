import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValid } from "../utils/validation.js";


export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "products",
    "name price images stock status isDeleted"
  );

  if (!wishlist) {
    return res.status(200).json({
      success: true,
      data: { products: [] },
    });
  }

  const products = wishlist.products.map((product) => ({
    product,
    isAvailable: Boolean(
      product && product.status === "Approved" && !product.isDeleted && product.stock > 0
    ),
  }));

  res.status(200).json({
    success: true,
    data: {
      wishlistId: wishlist._id,
      products,
    },
  });
});


export const addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  if (!isValid(productId)) {
    return next(new AppError("Product id is required", 400));
  }

  const product = await Product.findOne({
    _id: productId,
    status: "Approved",
    isDeleted: false,
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
  } else {
    const alreadyExists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      return next(new AppError("Product already in wishlist", 400));
    }

    wishlist.products.push(productId);
    await wishlist.save();
  }

  await wishlist.populate("products", "name price images stock status isDeleted");

  res.status(200).json({
    success: true,
    data: wishlist,
  });
});


export const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    return next(new AppError("Wishlist not found", 404));
  }

  const exists = wishlist.products.some((id) => id.toString() === productId);

  if (!exists) {
    return next(new AppError("Product not found in wishlist", 404));
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  );

  await wishlist.save();
  await wishlist.populate("products", "name price images stock status isDeleted");

  res.status(200).json({
    success: true,
    data: wishlist,
  });
});

export const getWishlistCount = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
 
  res.status(200).json({
    success: true,
    data: {
      count: wishlist ? wishlist.products.length : 0,
    },
  });
});
