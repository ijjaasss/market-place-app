import express from "express";
import { getSellerOrders, getOrderDetails, updateOrderStatus } from "../../controllers/seller/orderController.js";
import { sellerAuthMiddleware, isSeller, isApproveAdmin } from "../../middlewares/sellerMiddlware.js";

const router = express.Router();


router.use(sellerAuthMiddleware, isSeller,isApproveAdmin);

router.get("/", getSellerOrders);
router.get("/:id", getOrderDetails);
router.patch("/:id/status", updateOrderStatus);

export default router;