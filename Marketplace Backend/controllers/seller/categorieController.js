import Category from "../../models/Category.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getCategoriesForSeller = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({ isActive: true }).select("name image");

  res.status(200).json({ success: true, categories });
});
