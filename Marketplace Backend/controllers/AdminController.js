import Admin from "../models/Admin.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendToken } from "../utils/generateToken.js";
import { isValid } from "../utils/validation.js";
import User from "../models/User.js";
import Seller from "../models/Seller.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import Category from "../models/Category.js";

export const loginAdmin =asyncHandler( async (req, res,next) => {
    const { email, password } = req.body;
    if(!isValid( email, password)){
    return  next(new AppError("Please provide all required fields", 400));
    }
    const admin = await Admin.findOne({ email }).select('+password');
    if(!admin || !(await admin.matchPassword(password))){
        return next(new AppError("Invalid credentials", 400));
    }
      sendToken(admin,"adminToken", 200, res);
    

})



export const getAdminProfile = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
})



const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};


export const getAdminDashboard = async (req, res) => {
  try {
    const { start, end } = getTodayRange();
    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      pendingSellers,
      pendingProducts,
      todayOrders,
      revenueAgg,
      latestSellers,
      latestProducts,
      latestOrders,
      monthlySalesRaw,
      ordersByMonthRaw,
      productCategoriesRaw,
    ] = await Promise.all([
      User.countDocuments(),
      Seller.countDocuments(),
      Product.countDocuments({ isDeleted: false }),
      Order.countDocuments(),
      Seller.countDocuments({ status: "Pending" }),
      Product.countDocuments({ status: "Pending", isDeleted: false }),
      Order.countDocuments({ createdAt: { $gte: start, $lte: end } }),

      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
      ]),

      Seller.find({ status: "Pending" })
        .select("ownername shopname email phone status createdAt")
        .sort({ createdAt: -1 })
        .limit(5),

      Product.find({ isDeleted: false })
        .select("name price stock status images seller createdAt")
        .populate("seller", "shopname")
        .sort({ createdAt: -1 })
        .limit(5),

      Order.find()
        .select("user totalAmount orderStatus paymentStatus createdAt")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5),

      Order.aggregate([
        { $match: { paymentStatus: "Paid", createdAt: { $gte: startOfYear, $lte: endOfYear } } },
        { $group: { _id: { $month: "$createdAt" }, totalSales: { $sum: "$totalAmount" } } },
        { $sort: { _id: 1 } },
      ]),

      Order.aggregate([
        { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
        { $group: { _id: { $month: "$createdAt" }, totalOrders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      Product.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "categoryInfo" } },
        { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
        { $project: { _id: 0, category: { $ifNull: ["$categoryInfo.name", "Uncategorized"] }, count: 1 } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const revenue = revenueAgg[0]?.totalRevenue || 0;


    const monthlySales = Array.from({ length: 12 }, (_, i) => {
      const found = monthlySalesRaw.find((s) => s._id === i + 1);
      return { month: MONTH_NAMES[i], totalSales: found ? found.totalSales : 0 };
    });

    const ordersByMonth = Array.from({ length: 12 }, (_, i) => {
      const found = ordersByMonthRaw.find((o) => o._id === i + 1);
      return { month: MONTH_NAMES[i], totalOrders: found ? found.totalOrders : 0 };
    });


    const notifications = [];
    if (pendingSellers > 0) {
      notifications.push({
        type: "seller",
        message: `${pendingSellers} new seller registration${pendingSellers > 1 ? "s" : ""}`,
        count: pendingSellers,
      });
    }
    if (pendingProducts > 0) {
      notifications.push({
        type: "product",
        message: `${pendingProducts} product${pendingProducts > 1 ? "s" : ""} waiting for approval`,
        count: pendingProducts,
      });
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        pendingSellers,
        pendingProducts,
        revenue,
        todayOrders,
      },
      latestSellers,
      latestProducts,
      latestOrders,
      notifications,
      charts: {
        monthlySales,
        ordersByMonth,
        productCategories: productCategoriesRaw,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard data",
      error: error.message,
    });
  }
};


