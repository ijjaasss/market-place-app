import User from "../models/User.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendToken } from "../utils/generateToken.js";
import { isValid } from "../utils/validation.js";


export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  if (!isValid(name, email, phone, password)) {
    return next(new AppError("Please fill all the fields", 400));
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    return next(
      new AppError("User already exists with this email or phone", 400)
    );
  }

  const user = await User.create({ name, email, phone, password });

  sendToken(user, 201, res);
});


export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!isValid(email, password)) {
    return next(new AppError("Please enter email and password", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  if (user.isblocked) {
    return next(new AppError("Your account has been blocked", 403));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new AppError("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});


export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getUserProfile = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
})