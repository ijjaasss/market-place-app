

import Order from "../../models/Order.js";
import Withdrawal from "../../models/Withdrawal.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const calculateSellerEarnings = async (sellerId) => {

  const earningsData = await Order.aggregate([
    { $match: { "items.seller": sellerId, orderStatus: "Delivered",paymentStatus: "Paid" } },
    { $unwind: "$items" },
    { $match: { "items.seller": sellerId } },
    {
      $group: {
        _id: null,
        total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
  ]);
  const totalEarnings = earningsData[0]?.total || 0;


  const withdrawalData = await Withdrawal.aggregate([
    { $match: { seller: sellerId } },
    {
      $group: {
        _id: null,
        totalWithdrawn: {
          $sum: { $cond: [{ $eq: ["$status", "Paid"] }, "$amount", 0] },
        },
        pendingWithdrawal: {
          $sum: {
            $cond: [
              { $in: ["$status", ["Pending", "Approved"]] },
              "$amount",
              0,
            ],
          },
        },
      },
    },
  ]);

  const totalWithdrawn = withdrawalData[0]?.totalWithdrawn || 0;
  const pendingWithdrawal = withdrawalData[0]?.pendingWithdrawal || 0;
  
  const availableBalance = totalEarnings - totalWithdrawn - pendingWithdrawal;

  return {
    totalEarnings,
    totalWithdrawn,
    pendingWithdrawal,
    availableBalance,
  };
};

// 1. Get Earnings Dashboard & Withdrawal History
export const getSellerWithdrawals = asyncHandler(async (req, res, next) => {
  const sellerId = req.seller._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Fetch dynamic balance metrics
  const cards = await calculateSellerEarnings(sellerId);

  // Fetch paginated history and the most recent bank details used
  const [withdrawals, totalRecords, lastRequest] = await Promise.all([
    Withdrawal.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id amount status remarks requestedAt processedAt"),
    Withdrawal.countDocuments({ seller: sellerId }),
    Withdrawal.findOne({ seller: sellerId }).sort({ createdAt: -1 }),
  ]);

  // Fallback if the seller has never submitted bank details before
  const bankDetails = lastRequest?.bankDetails || null;

  res.status(200).json({
    success: true,
    cards,
    bankDetails,
    withdrawals,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
  });
});

// 2. Request a New Payout / Withdrawal
export const requestWithdrawal = asyncHandler(async (req, res, next) => {
  const sellerId = req.seller._id;
  const { amount, bankDetails } = req.body;

  // Input sanitization
  if (!amount || amount <= 0) {
    return next(new AppError("Please specify a valid withdrawal amount greater than zero", 400));
  }

  if (
    !bankDetails ||
    !bankDetails.accountHolderName ||
    !bankDetails.accountNumber ||
    !bankDetails.ifscCode ||
    !bankDetails.bankName
  ) {
    return next(new AppError("Complete bank details are required to process payments", 400));
  }

  // Double-check real-time ledger verification to prevent overdrafts
  const metrics = await calculateSellerEarnings(sellerId);
  if (amount > metrics.availableBalance) {
    return next(
      new AppError(
        `Insufficient funds. Your maximum requestable balance is ${metrics.availableBalance}`,
        400
      )
    );
  }

  // Log the withdrawal request securely
  const newWithdrawal = await Withdrawal.create({
    seller: sellerId,
    amount,
    bankDetails,
  });

  res.status(201).json({
    success: true,
    message: "Withdrawal request submitted successfully and is pending review.",
    withdrawal: {
      _id: newWithdrawal._id,
      amount: newWithdrawal.amount,
      status: newWithdrawal.status,
      requestedAt: newWithdrawal.createdAt,
    },
  });
});