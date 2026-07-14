import express from "express";
import {
  createReview,
  getProductReviews,
  
  deleteReview,
} from "../controllers/reviewController.js";
import { userAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.post("/", userAuthMiddleware, createReview);

router.delete("/:id", userAuthMiddleware, deleteReview);

export default router;