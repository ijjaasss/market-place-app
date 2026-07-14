import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlistCount,
} from "../controllers/wishlistController.js";
import { userAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(userAuthMiddleware);

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/:productId", removeFromWishlist);
router.get("/count", getWishlistCount);
export default router;