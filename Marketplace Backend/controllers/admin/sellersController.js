import mongoose from "mongoose";
import Seller from "../../models/Seller.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const updateSellerStatus =asyncHandler(async(req,res,next)=>{
     const Id=req.params.id
     const { status } = req.body;

     if (!["Approved", "Rejected"].includes(status)) {
      return next(new AppError("Invalid status", 400));
    }
     const seller=await Seller.findByIdAndUpdate(
     Id,
     {status},
     {new:true}
     )
     if(!seller){
        return next(new AppError("seller not found",404))
     }
     seller.password=undefined
     res.status(200).json({success: true, message: `Seller ${status}`, data: seller })
})

export const blockUnblockSeller = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const seller = await Seller.findById(id);

  if (!seller) {
    return next(new AppError("Seller not found", 404));
  }

  seller.isBlocked = !seller.isBlocked;

  await seller.save();

  seller.password = undefined;

  res.status(200).json({
    success: true,
    message: seller.isBlocked
      ? "Seller blocked successfully"
      : "Seller unblocked successfully",
    data: seller,
  });
});





export const getAllSellers = asyncHandler(async (req, res, next) => {
  let {
    page = 1,
    limit = 2,
    search = "",
    status,
    sort = "newest",
  } = req.query;

  page = Number(page);
  limit = Number(limit);

  const query = {};

  if (search) {
    query.$or = [
      { ownername: { $regex: search, $options: "i" } },
      { shopname: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }


  if (status && status !== "All") {
    query.status = status;
  }


  let sortOption = {};

  switch (sort) {
    case "oldest":
      sortOption = { createdAt: 1 };
      break;

    case "name":
      sortOption = { ownername: 1 };
      break;

    case "shop":
      sortOption = { shopname: 1 };
      break;

    default:
      sortOption = { createdAt: -1 };
  }

  const total = await Seller.countDocuments();

  const sellers = await Seller.find(query)
    .select("-password")
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    
    totalRecords:total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    limit,
    count: sellers.length,
    sellers,
  });
});


export const getSellerById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;


  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid seller ID", 400));
  }

  const seller = await Seller.findById(id).select("-password");

  if (!seller) {
    return next(new AppError("Seller not found", 404));
  }

  res.status(200).json({
    success: true,
    seller,
  });
});
