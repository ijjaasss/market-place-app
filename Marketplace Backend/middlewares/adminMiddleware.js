import env from "../config/env.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import Admin from "../models/Admin.js";

export const adminAuthMiddleware = asyncHandler(async (req, res, next) => {

    
       let token;


    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

  
  


    if (!token) {
         
      return next(new AppError("Unauthorized", 401));
    }
    const decoded = jwt.verify(token, env.JWT_SECRET);
   
   
    req.admin = await Admin.findById(decoded.id).select("-password");
   
   
    next();
 
})

export const isAdmin = (req, res, next) => {

  if (req.admin && req.admin.role === "admin") {
    next();
  } else {
    next(new AppError("Access denied. Admins only.", 403));
  }
};

