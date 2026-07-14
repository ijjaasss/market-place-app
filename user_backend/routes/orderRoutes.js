import express from "express";
import {
  getOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController.js";
import { userAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(userAuthMiddleware);

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/cancel", cancelOrder);

export default router;