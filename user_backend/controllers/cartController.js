import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValid } from "../utils/validation.js";


export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price images stock status isDeleted"
  );

  if (!cart) {
    return res.status(200).json({
      success: true,
      data: { items: [], subtotal: 0 },
    });
  }

  let subtotal = 0;

  const items = cart.items.map((item) => {
    const product = item.product;
    const isAvailable =
      product && product.status === "Approved" && !product.isDeleted;

    const lineTotal =
      isAvailable && product.stock > 0
        ? product.price * item.quantity
        : 0;

    subtotal += lineTotal;

    return {
      product,
      quantity: item.quantity,
      isAvailable: Boolean(isAvailable && product.stock > 0),
      lineTotal,
    };
  });

  res.status(200).json({
    success: true,
    data: {
      cartId: cart._id,
      items,
      subtotal,
    },
  });
});


export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  if (!isValid(productId)) {
    return next(new AppError("Product id is required", 400));
  }

  if (quantity < 1) {
    return next(new AppError("Quantity must be at least 1", 400));
  }

  const product = await Product.findOne({
    _id: productId,
    status: "Approved",
    isDeleted: false,
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  const requestedQuantity = existingItem
    ? existingItem.quantity + Number(quantity)
    : Number(quantity);

  if (requestedQuantity > product.stock) {
    return next(
      new AppError(`Only ${product.stock} item(s) left in stock`, 400)
    );
  }

  if (existingItem) {
    existingItem.quantity = requestedQuantity;
  } else {
    cart.items.push({ product: productId, quantity: requestedQuantity });
  }

  await cart.save();
  await cart.populate("items.product", "name price images stock status isDeleted");

  res.status(200).json({
    success: true,
    data: cart,
  });
});


export const updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!isValid(quantity) || quantity < 1) {
    return next(new AppError("Quantity must be at least 1", 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    return next(new AppError("Item not found in cart", 404));
  }

  const product = await Product.findOne({
    _id: productId,
    status: "Approved",
    isDeleted: false,
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (quantity > product.stock) {
    return next(
      new AppError(`Only ${product.stock} item(s) left in stock`, 400)
    );
  }

  item.quantity = Number(quantity);

  await cart.save();
  await cart.populate("items.product", "name price images stock status isDeleted");

  res.status(200).json({
    success: true,
    data: cart,
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
 
  if (!cart || cart.items.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Cart is already empty",
    });
  }
 
  cart.items = [];
  await cart.save();
 
  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
  });
});

export const getCartCount = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
 
  if (!cart) {
    return res.status(200).json({
      success: true,
      data: { itemsCount: 0, totalQuantity: 0 },
    });
  }
 
  const totalQuantity = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
 
  res.status(200).json({
    success: true,
    data: {
      itemsCount: cart.items.length,
      totalQuantity,
    },
  });
});


export const removeCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const itemExists = cart.items.some(
    (item) => item.product.toString() === productId
  );

  if (!itemExists) {
    return next(new AppError("Item not found in cart", 404));
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();
  await cart.populate("items.product", "name price images stock status isDeleted");

  res.status(200).json({
    success: true,
    data: cart,
  });
});