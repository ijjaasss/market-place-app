import express from "express";

import { isSeller, sellerAuthMiddleware } from "../../middlewares/sellerMiddlware.js";
import { getReviewDetails, getSellerReviews } from "../../controllers/seller/reviewController.js";

const router = express.Router();

router.use(sellerAuthMiddleware, isSeller);

router.get("/", getSellerReviews);
router.get("/:id", getReviewDetails);

export default router;