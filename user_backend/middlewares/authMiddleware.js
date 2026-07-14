import env from "../config/env.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import User from "../models/User.js";


export const userAuthMiddleware = asyncHandler(async (req, res, next) => {

    
       let token;


    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

  
  


    if (!token) {
         
      return next(new AppError("Unauthorized", 401));
    }
    const decoded = jwt.verify(token, env.JWT_SECRET);
   
   
    req.user = await User.findById(decoded.id).select("-password");
   
   
    next();
 
})
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  // No login -> continue as guest
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
  } catch (err) {
    // Invalid/expired token -> treat as guest
    req.user = null;
  }

  next();
});
export const isAdmin = (req, res, next) => {

  if (req.user && req.user.role === "customer") {
    next();
  } else {
    next(new AppError("Access denied. Admins only.", 403));
  }
};

