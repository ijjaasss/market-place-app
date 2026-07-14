import env from "../config/env.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import Seller from "../models/Seller.js";


export const sellerAuthMiddleware = asyncHandler(async (req, res, next) => {

    
       let token;


    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

  
  


    if (!token) {
         
      return next(new AppError("Unauthorized", 401));
    }
    const decoded = jwt.verify(token, env.JWT_SECRET);
   
   
    req.seller = await Seller.findById(decoded.id).select("-password");
   
   
    next();
 
})

export const isSeller = (req, res, next) => {

  if (req.seller && req.seller.role === "seller") {
    next();
  } else {
    next(new AppError("Access denied. Seller only.", 403));
  }
};

export const isApproveAdmin=(req, res, next) => {

  if (req.seller && req.seller.status === "Approved") {
    next();
  } else {
    next(new AppError("Access denied. Admin not Aproved.", 403));
  }
};
