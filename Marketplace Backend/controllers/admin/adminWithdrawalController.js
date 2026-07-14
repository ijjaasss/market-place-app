import mongoose from "mongoose";
import Withdrawal from "../../models/Withdrawal.js";
import Order from "../../models/Order.js";
import Seller from "../../models/Seller.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


const WITHDRAWAL_STATUSES = ["Pending", "Approved", "Rejected", "Paid"];

const SORT_OPTIONS = {
  newest: { requestedAt: -1 },
  oldest: { requestedAt: 1 },
  "amount-asc": { amount: 1 },
  "amount-desc": { amount: -1 },
};


export const getWithdrawals = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, status, sort } = req.query;

  const matchStage = {};
  if (status && WITHDRAWAL_STATUSES.includes(status)) {
    matchStage.status = status;
  }

  const sortBy = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "sellers",
        localField: "seller",
        foreignField: "_id",
        as: "sellerInfo",
      },
    },
    { $unwind: "$sellerInfo" },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { "sellerInfo.ownername": { $regex: search, $options: "i" } },
          { "sellerInfo.shopname": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  pipeline.push(
    { $sort: sortBy },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              amount: 1,
              status: 1,
              requestedAt: 1,
              sellerName: "$sellerInfo.ownername",
              shopName: "$sellerInfo.shopname",
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    }
  );

  const [
    result,
    totalRequests,
    pendingCount,
    approvedCount,
    paidCount,
    totalPaidAmountAgg,
  ] = await Promise.all([
    Withdrawal.aggregate(pipeline),
    Withdrawal.countDocuments({}),
    Withdrawal.countDocuments({ status: "Pending" }),
    Withdrawal.countDocuments({ status: "Approved" }),
    Withdrawal.countDocuments({ status: "Paid" }),
    Withdrawal.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const withdrawals = result[0]?.data || [];
  const totalRecords = result[0]?.totalCount?.[0]?.count || 0;
  const totalPaidAmount = totalPaidAmountAgg[0]?.total || 0;

  res.status(200).json({
    success: true,
    cards: {
      totalRequests,
      pending: pendingCount,
      approved: approvedCount,
      paid: paidCount,
      totalPaidAmount,
    },
    withdrawals,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    totalRecords,
    limit,
  });
});


export const getWithdrawalById = asyncHandler(async (req, res, next) => {
  const withdrawal = await Withdrawal.findById(req.params.id).populate(
    "seller",
    "ownername shopname email phone"
  );

  if (!withdrawal) {
    return next(new AppError("Withdrawal request not found", 404));
  }

  const sellerId = withdrawal.seller._id;

  const [totalEarningsAgg, paidOutAgg, lockedAgg] = await Promise.all([
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
    Withdrawal.aggregate([
      { $match: { seller: sellerId, status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Withdrawal.aggregate([
      { $match: { seller: sellerId, status: { $in: ["Pending", "Approved"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const totalEarnings = totalEarningsAgg[0]?.total || 0;
  const totalPaidOut = paidOutAgg[0]?.total || 0;
  const totalLocked = lockedAgg[0]?.total || 0;
  const availableBalance = totalEarnings - totalPaidOut - totalLocked;

  res.status(200).json({
    success: true,
    seller: withdrawal.seller,
    withdrawal: {
      _id: withdrawal._id,
      amount: withdrawal.amount,
      status: withdrawal.status,
      requestedAt: withdrawal.requestedAt,
      processedAt: withdrawal.processedAt,
      remarks: withdrawal.remarks,
      transactionId: withdrawal.transactionId,
    },
    bankDetails: withdrawal.bankDetails,
    earningsSummary: {
      totalEarnings,
      totalPaidOut,
      totalLocked,
      availableBalance,
    },
  });
});


export const approveWithdrawal = asyncHandler(async (req, res, next) => {
  const withdrawal = await Withdrawal.findById(req.params.id);

  if (!withdrawal) {
    return next(new AppError("Withdrawal request not found", 404));
  }

  if (withdrawal.status !== "Pending") {
    return next(new AppError(`Cannot approve a request that is already ${withdrawal.status}`, 400));
  }

  withdrawal.status = "Approved";
  withdrawal.processedAt = new Date();
  if (req.body.remarks) withdrawal.remarks = req.body.remarks;

  await withdrawal.save();

  res.status(200).json({
    success: true,
    message: "Withdrawal request approved",
    withdrawal,
  });
});


export const rejectWithdrawal = asyncHandler(async (req, res, next) => {
  const { remarks } = req.body;

  if (!remarks?.trim()) {
    return next(new AppError("Remarks are required when rejecting a withdrawal", 400));
  }

  const withdrawal = await Withdrawal.findById(req.params.id);

  if (!withdrawal) {
    return next(new AppError("Withdrawal request not found", 404));
  }

  if (["Rejected", "Paid"].includes(withdrawal.status)) {
    return next(new AppError(`Cannot reject a request that is already ${withdrawal.status}`, 400));
  }

  withdrawal.status = "Rejected";
  withdrawal.remarks = remarks.trim();
  withdrawal.processedAt = new Date();

  await withdrawal.save();

  res.status(200).json({
    success: true,
    message: "Withdrawal request rejected",
    withdrawal,
  });
});


export const payWithdrawal = asyncHandler(async (req, res, next) => {
  const { transactionId, remarks } = req.body;

  if (!transactionId?.trim()) {
    return next(new AppError("Transaction ID is required to mark a withdrawal as paid", 400));
  }

  const withdrawal = await Withdrawal.findById(req.params.id);

  if (!withdrawal) {
    return next(new AppError("Withdrawal request not found", 404));
  }

  if (withdrawal.status !== "Approved") {
    return next(new AppError("Only approved withdrawals can be marked as paid", 400));
  }

  withdrawal.status = "Paid";
  withdrawal.transactionId = transactionId.trim();
  if (remarks) withdrawal.remarks = remarks;
  withdrawal.processedAt = new Date();

  await withdrawal.save();

  res.status(200).json({
    success: true,
    message: "Withdrawal marked as paid",
    withdrawal,
  });
});