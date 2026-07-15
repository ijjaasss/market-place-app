import { asyncHandler } from "../utils/asyncHandler.js";

export const LogoutSeller = asyncHandler(async (req, res) => {
  res.cookie("sellerToken", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
export const LogoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("adminToken", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});