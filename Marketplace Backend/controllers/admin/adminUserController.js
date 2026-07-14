import User from "../../models/User.js";
import Order from "../../models/Order.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import AppError from "../../utils/appError.js";

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "name-asc": { name: 1 },
};

const NEW_USER_WINDOW_DAYS = 7;


export const getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, status, sort } = req.query;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (status === "active") filter.isblocked = false;
  if (status === "blocked") filter.isblocked = true;

  const sortBy = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;

  const newUserSince = new Date();
  newUserSince.setDate(newUserSince.getDate() - NEW_USER_WINDOW_DAYS);

  const [users, totalRecords, totalCount, activeCount, blockedCount, newCount] =
    await Promise.all([
      User.find(filter)
        .select("name email phone profileImage isblocked createdAt")
        .sort(sortBy)
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
      User.countDocuments({}),
      User.countDocuments({ isblocked: false }),
      User.countDocuments({ isblocked: true }),
      User.countDocuments({ createdAt: { $gte: newUserSince } }),
    ]);

  res.status(200).json({
    success: true,
    cards: {
      totalUsers: totalCount,
      activeUsers: activeCount,
      blockedUsers: blockedCount,
      newUsers: newCount,
    },
    users,
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    limit,
  });
});


export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    "name email phone profileImage isblocked createdAt updatedAt"
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const [
    totalOrders,
    completedOrders,
    cancelledOrders,
    totalSpentAgg,
    recentOrdersRaw,
  ] = await Promise.all([
    Order.countDocuments({ user: user._id }),
    Order.countDocuments({ user: user._id, orderStatus: "Delivered" }),
    Order.countDocuments({ user: user._id, orderStatus: "Cancelled" }),
    Order.aggregate([
      { $match: { user: user._id, paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Order.find({ user: user._id })
      .select("totalAmount orderStatus createdAt")
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  const totalSpent = totalSpentAgg[0]?.total || 0;

  const recentOrders = recentOrdersRaw.map((order) => ({
    orderId: order._id,
    date: order.createdAt,
    amount: order.totalAmount,
    status: order.orderStatus,
  }));

  res.status(200).json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      joinedDate: user.createdAt,
      status: user.isblocked ? "Blocked" : "Active",
    },
    statistics: {
      totalOrders,
      completedOrders,
      cancelledOrders,
      totalSpent,
    },
    recentOrders,
  });
});


export const updateUserStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.isblocked =
    typeof req.body.isBlocked === "boolean" ? req.body.isBlocked : !user.isblocked;

  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isblocked ? "blocked" : "unblocked"} successfully`,
    user,
  });
});