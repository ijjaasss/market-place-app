import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValid } from "../utils/validation.js";
import Payment from "../models/Payment.js"
const CANCELLABLE_STATUSES = ["Pending", "Confirmed"];


export const checkout = asyncHandler(async (req, res, next) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (
    !shippingAddress ||
    !isValid(
      shippingAddress.fullName,
      shippingAddress.phone,
      shippingAddress.address,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.pincode,
      shippingAddress.country
    )
  ) {
    return next(new AppError("Please provide a complete shipping address", 400));
  }

  if (!["COD", "Online"].includes(paymentMethod)) {
    return next(new AppError("Please select a valid payment method", 400));
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Your cart is empty", 400));
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const cartItem of cart.items) {
    const product = cartItem.product;

    if (!product || product.status !== "Approved" || product.isDeleted) {
      return next(
        new AppError(
          `"${product?.name || "A product"}" in your cart is no longer available`,
          400
        )
      );
    }

    if (cartItem.quantity > product.stock) {
      return next(
        new AppError(`Only ${product.stock} unit(s) of "${product.name}" left in stock`, 400)
      );
    }

    orderItems.push({
      product: product._id,
      seller: product.seller,
      quantity: cartItem.quantity,
      price: product.price,
    });

    totalAmount += product.price * cartItem.quantity;
  }


  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    totalAmount,
    paymentMethod,
    paymentStatus: "Pending",
    orderStatus: "Pending",
  });

  cart.items = [];
  await cart.save();
  
  await Payment.create({
  user: req.user._id,
  order: order._id,
  amount: totalAmount,
  paymentMethod,
  paymentStatus:  "Pending",
  transactionId: "",
});

  res.status(201).json({
    success: true,
    data: order,
  });
});


export const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .populate("items.product", "name images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments({ user: req.user._id }),
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    data: orders,
  });
});


export const getOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid order id", 400));
  }

  const order = await Order.findOne({ _id: id, user: req.user._id })
    .populate("items.product", "name images price")
    .populate("items.seller", "shopname");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});


export const cancelOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({ _id: id, user: req.user._id });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (!CANCELLABLE_STATUSES.includes(order.orderStatus)) {
    return next(
      new AppError(
        `Order cannot be cancelled once it is "${order.orderStatus}"`,
        400
      )
    );
  }


  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  order.orderStatus = "Cancelled";
  await order.save();

  res.status(200).json({
    success: true,
    data: order,
  });
});