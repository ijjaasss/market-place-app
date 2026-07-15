import Seller from "../models/Seller.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendToken } from "../utils/generateToken.js";
import { isValid } from "../utils/validation.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Category from "../models/Category.js";

export const registerSeller=asyncHandler(async(req,res,next)=>{
    const {ownername,shopname,email,phone,password,description,address,city,state,country,pincode,gstNumber}=req.body
    const emailExists=await Seller.findOne({email})
    const phoneExists=await Seller.findOne({phone})

    if(emailExists||phoneExists){
        return next(new AppError("email or phone number alredy exists"))
    }
    if(!isValid(ownername,shopname,email,phone,password,description,address,city,state,country,pincode,gstNumber)){
        return next(new AppError('all field are required'))
    }
    const logo = req.files?.logo?.[0]?.path || "";
    const front = req.files?.front?.[0]?.path || "";
    const back = req.files?.back?.[0]?.path || "";

    
    if(!isValid(front,back)){
        return next(new AppError("id proof is required"))
    }
        const seller = await Seller.create({
      ownername,
      shopname,
      email,
      phone,
      password,
      description,
      address,
      city,
      state,
      country,
      pincode,
      gstNumber,
      logo,
      idProof: {
        front,
        back,
      },
    });
    if(seller){
      res.status(201).json({
      success: true,
      message: "Registration successful. Waiting for admin approval.",
      seller,
    });
    }else{
        return next(new AppError('Invalid seller data',400))
    }
    
})

export const loginSeller =asyncHandler( async (req, res,next) => {
    const { email, password } = req.body;
    if(!isValid( email, password)){
    return  next(new AppError("Please provide all required fields", 400));
    }
    const seller = await Seller.findOne({ email }).select('+password');
    if(!seller || !(await seller.matchPassword(password))){
        return next(new AppError("Invalid credentials", 400));
    }
    if(seller.isBlocked){
        return next(new AppError( "Your account has been blocked. Please contact the administrator.",403))
    }
      sendToken(seller,"sellerToken", 200, res);
    

})

export const getSellerProfile = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    seller: req.seller,
  });
})



const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const LOW_STOCK_THRESHOLD = 5;


export const getSellerDashboard = asyncHandler(async (req, res, next) => {
  if (!req.seller?._id) {
    return next(new AppError("Not authorized as seller", 401));
  }

  const sellerId = new mongoose.Types.ObjectId(req.seller._id);

  const year = new Date().getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [
    totalProducts,
    pendingProducts,
    approvedProducts,
    rejectedProducts,
    totalOrders,
    pendingOrders,
    revenueAgg,
    monthlyRevenueAgg,
    salesChartRaw,
    orderChartRaw,
    productChartRaw,
    recentOrdersRaw,
    recentProducts,
    lowStockProducts,
    latestReviews,
  ] = await Promise.all([
    Product.countDocuments({ seller: sellerId, isDeleted: false }),
    Product.countDocuments({ seller: sellerId, isDeleted: false, status: "Pending" }),
    Product.countDocuments({ seller: sellerId, isDeleted: false, status: "Approved" }),
    Product.countDocuments({ seller: sellerId, isDeleted: false, status: "Rejected" }),

    Order.countDocuments({ "items.seller": sellerId }),
    Order.countDocuments({ "items.seller": sellerId, orderStatus: "Pending" }),

    Order.aggregate([
      { $match: { paymentStatus: "Paid", "items.seller": sellerId } },
      { $unwind: "$items" },
      { $match: { "items.seller": sellerId } },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
    ]),

    Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          "items.seller": sellerId,
          createdAt: { $gte: startOfThisMonth, $lt: startOfNextMonth },
        },
      },
      { $unwind: "$items" },
      { $match: { "items.seller": sellerId } },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
    ]),

    Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          "items.seller": sellerId,
          createdAt: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      { $unwind: "$items" },
      { $match: { "items.seller": sellerId } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    Order.aggregate([
      { $match: { "items.seller": sellerId } },
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]),

    Product.aggregate([
      { $match: { seller: sellerId, isDeleted: false } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    Order.find({ "items.seller": sellerId })
      .select("user items totalAmount orderStatus paymentStatus createdAt")
      .populate("user", "name email")
      .populate("items.product", "name images")
      .sort({ createdAt: -1 })
      .limit(5),

    Product.find({ seller: sellerId, isDeleted: false })
      .select("name price stock status images createdAt")
      .sort({ createdAt: -1 })
      .limit(5),

    Product.find({ seller: sellerId, isDeleted: false, stock: { $lte: LOW_STOCK_THRESHOLD } })
      .select("name stock")
      .sort({ stock: 1 })
      .limit(5),

    Review.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      { $match: { "productInfo.seller": sellerId } },
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          rating: 1,
          review: 1,
          createdAt: 1,
          product: "$productInfo.name",
          user: "$userInfo.name",
        },
      },
    ]),
  ]);

  const revenue = revenueAgg[0]?.total || 0;
  const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;

  const salesChart = Array.from({ length: 12 }, (_, i) => {
    const found = salesChartRaw.find((s) => s._id === i + 1);
    return { month: MONTH_NAMES[i], totalSales: found ? found.totalSales : 0 };
  });

  const ORDER_STATUSES = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];
  const orderChart = ORDER_STATUSES.map((status) => {
    const found = orderChartRaw.find((o) => o._id === status);
    return { status, count: found ? found.count : 0 };
  });

  const PRODUCT_STATUSES = ["Approved", "Pending", "Rejected"];
  const productChart = PRODUCT_STATUSES.map((status) => {
    const found = productChartRaw.find((p) => p._id === status);
    return { status, count: found ? found.count : 0 };
  });

  const recentOrders = recentOrdersRaw.map((order) => {
    const sellerItems = order.items.filter(
      (item) => item.seller?.toString() === sellerId.toString()
    );
    const sellerAmount = sellerItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return {
      orderId: order._id,
      customer: order.user?.name || "N/A",
      products: sellerItems.map((item) => item.product?.name).filter(Boolean),
      amount: sellerAmount,
      status: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
    };
  });

  const recentProductsFormatted = recentProducts.map((p) => ({
    _id: p._id,
    name: p.name,
    price: p.price,
    stock: p.stock,
    status: p.stock === 0 ? "Out of Stock" : p.status,
    images: p.images,
    createdAt: p.createdAt,
  }));

  const notifications = [];
  if (pendingProducts > 0) {
    notifications.push({
      type: "product",
      message: `${pendingProducts} product${pendingProducts > 1 ? "s" : ""} pending approval`,
      count: pendingProducts,
    });
  }
  if (pendingOrders > 0) {
    notifications.push({
      type: "order",
      message: `${pendingOrders} order${pendingOrders > 1 ? "s" : ""} pending`,
      count: pendingOrders,
    });
  }
  if (lowStockProducts.length > 0) {
    notifications.push({
      type: "stock",
      message: `${lowStockProducts.length} product${lowStockProducts.length > 1 ? "s" : ""} low on stock`,
      count: lowStockProducts.length,
    });
  }

  res.status(200).json({
    success: true,
    cards: {
      totalProducts,
      pendingProducts,
      approvedProducts,
      rejectedProducts,
      totalOrders,
      pendingOrders,
      revenue,
      monthlyRevenue,
    },
    salesChart,
    orderChart,
    productChart,
    recentOrders,
    recentProducts: recentProductsFormatted,
    lowStockProducts,
    latestReviews,
    notifications,
  });
});
