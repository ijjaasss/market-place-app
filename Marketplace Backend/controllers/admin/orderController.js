import Order from "../../models/Order.js";
import Payment from "../../models/Payment.js"
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


const ORDER_STATUSES = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed"];
const PAYMENT_METHODS = ["COD", "Online"];

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "amount-asc": { totalAmount: 1 },
  "amount-desc": { totalAmount: -1 },
};


export const getOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, status, payment, sort } = req.query;

  const filter = {};

  // search matches customer name/phone from the shipping address (no separate "customer name" field on Order)
  if (search) {
    filter.$or = [
      { "shippingAddress.fullName": { $regex: search, $options: "i" } },
      { "shippingAddress.phone": { $regex: search, $options: "i" } },
    ];
  }

  if (status && ORDER_STATUSES.includes(status)) {
    filter.orderStatus = status;
  }

  if (payment && PAYMENT_METHODS.includes(payment)) {
    filter.paymentMethod = payment;
  }

  const sortBy = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;

  const [
    orders,
    totalRecords,
    totalCount,
    pendingCount,
    confirmedCount,
    shippedCount,
    deliveredCount,
    cancelledCount,
  ] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email phone")
      .sort(sortBy)
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
    Order.countDocuments({}),
    Order.countDocuments({ orderStatus: "Pending" }),
    Order.countDocuments({ orderStatus: "Confirmed" }),
    Order.countDocuments({ orderStatus: "Shipped" }),
    Order.countDocuments({ orderStatus: "Delivered" }),
    Order.countDocuments({ orderStatus: "Cancelled" }),
  ]);

  res.status(200).json({
    success: true,
    cards: {
      totalOrders: totalCount,
      pendingOrders: pendingCount,
      confirmedOrders: confirmedCount,
      shippedOrders: shippedCount,
      deliveredOrders: deliveredCount,
      cancelledOrders: cancelledCount,
    },
    orders,
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    limit,
  });
});


export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email phone")
    .populate("items.product", "name images price")
    .populate("items.seller", "shopname ownername");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({ success: true, order });
});


export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderStatus } = req.body;

  if (!ORDER_STATUSES.includes(orderStatus)) {
    return next(
      new AppError(`orderStatus must be one of: ${ORDER_STATUSES.join(", ")}`, 400)
    );
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  order.orderStatus = orderStatus;
  await order.save();

  res.status(200).json({
    success: true,
    message: `Order status updated to ${orderStatus}`,
    order,
  });
});


export const updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const { paymentStatus } = req.body;

  if (!PAYMENT_STATUSES.includes(paymentStatus)) {
    return next(
      new AppError(`paymentStatus must be one of: ${PAYMENT_STATUSES.join(", ")}`, 400)
    );
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  order.paymentStatus = paymentStatus;
  await order.save();

  // keep the Payment collection in sync, if a payment record exists for this order
  const paymentStatusMap = { Pending: "Pending", Paid: "Success", Failed: "Failed" };
  await Payment.findOneAndUpdate(
    { order: order._id },
    { status: paymentStatusMap[paymentStatus] }
  );

  res.status(200).json({
    success: true,
    message: `Payment status updated to ${paymentStatus}`,
    order,
  });
});