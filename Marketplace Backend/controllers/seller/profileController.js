import Seller from "../../models/Seller.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";



export const updateSellerProfile = asyncHandler(async (req, res, next) => {
  const {
    ownername,
    shopname,
    description,
    email,
    phone,
    address,
    city,
    state,
    country,
    pincode,
    gstNumber,
  } = req.body;

  const seller = await Seller.findById(req.seller._id);

  if (!seller) {
    return next(new AppError("Seller not found", 404));
  }


  if (email && email !== seller.email) {
    const emailExists = await Seller.findOne({ email });
    if (emailExists) return next(new AppError("Email is already in use", 400));
  }

  if (phone && phone !== seller.phone) {
    const phoneExists = await Seller.findOne({ phone });
    if (phoneExists) return next(new AppError("Phone number is already in use", 400));
  }

  if (ownername) seller.ownername = ownername;
  if (shopname) seller.shopname = shopname;
  if (description) seller.description = description;
  if (email) seller.email = email;
  if (phone) seller.phone = phone;
  if (address) seller.address = address;
  if (city) seller.city = city;
  if (state) seller.state = state;
  if (country) seller.country = country;
  if (pincode) seller.pincode = pincode;
  if (gstNumber) seller.gstNumber = gstNumber;

  await seller.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    seller,
  });
});

export const updateSellerLogo = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.logo) {
    return next(new AppError("Please upload a logo image", 400));
  }

  const seller = await Seller.findById(req.seller._id);

  if (!seller) {
    return next(new AppError("Seller not found", 404));
  }

  seller.logo = req.files.logo[0].path; 

  await seller.save();

  res.status(200).json({
    success: true,
    message: "Logo updated successfully",
    logo: seller.logo,
  });
});

export const updateSellerPassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError("Please provide both current and new passwords", 400));
  }

  const seller = await Seller.findById(req.seller._id);

  if (!seller) {
    return next(new AppError("Seller not found", 404));
  }

  const isMatch = await seller.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new AppError("Incorrect current password", 401));
  }


  seller.password = newPassword;
  await seller.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});