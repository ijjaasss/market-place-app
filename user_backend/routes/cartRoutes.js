import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartCount,
} from "../controllers/cartController.js";
import { userAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(userAuthMiddleware);

router.get("/", getCart);
router.post("/", addToCart);
router.patch("/:productId", updateCartItem);
router.delete("/:productId", removeCartItem);
router.delete("/", clearCart);
router.get("/count", getCartCount);
export default router;