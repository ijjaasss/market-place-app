
import Order from "../../models/Order.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "amount-asc": { totalAmount: 1 },
  "amount-desc": { totalAmount: -1 },
};

export const getSellerOrders = asyncHandler(async (req, res, next) => {
  const sellerId = req.seller._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, status, payment, sort } = req.query;

  const filter = { "items.seller": sellerId };

  if (search) {
    filter.$or = [
      { "shippingAddress.fullName": { $regex: search, $options: "i" } },
      { "shippingAddress.phone": { $regex: search, $options: "i" } },
      { "shippingAddress.city": { $regex: search, $options: "i" } }
    ];
  }

  if (status && ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].includes(status)) {
    filter.orderStatus = status;
  }

  if (payment && ["COD", "Online"].includes(payment)) {
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
      .populate("user", "name email") 
      .sort(sortBy)
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter), 
    Order.countDocuments({ "items.seller": sellerId }), 
    Order.countDocuments({ "items.seller": sellerId, orderStatus: "Pending" }),
    Order.countDocuments({ "items.seller": sellerId, orderStatus: "Confirmed" }),
    Order.countDocuments({ "items.seller": sellerId, orderStatus: "Shipped" }),
    Order.countDocuments({ "items.seller": sellerId, orderStatus: "Delivered" }),
    Order.countDocuments({ "items.seller": sellerId, orderStatus: "Cancelled" }),
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


export const getOrderDetails = asyncHandler(async (req, res, next) => {
  const sellerId = req.seller._id;

  const order = await Order.findOne({
    _id: req.params.id,
    "items.seller": sellerId,
  })
    .populate("user", "name email")
    .populate("items.product", "name images price brand category");

  if (!order) {
    return next(new AppError("Order not found or you don't have access to it", 404));
  }


  const sellerItems = order.items.filter(
    (item) => item.seller.toString() === sellerId.toString()
  );


  const sellerTotalAmount = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  res.status(200).json({
    success: true,
    order: {
      ...order.toObject(),
      items: sellerItems,
      sellerTotalAmount 
    },
  });
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderStatus } = req.body;

  const validStatuses = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];
  
  if (!validStatuses.includes(orderStatus)) {
    return next(new AppError("Invalid order status provided", 400));
  }

  const order = await Order.findOne({
    _id: req.params.id,
    "items.seller": req.seller._id,
  });

  if (!order) {
    return next(new AppError("Order not found or unauthorized", 404));
  }

  order.orderStatus = orderStatus;
  await order.save();

  res.status(200).json({
    success: true,
    message: `Order status successfully updated to ${orderStatus}`,
    order,
  });
});