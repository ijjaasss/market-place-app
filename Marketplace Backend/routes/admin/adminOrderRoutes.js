import express from "express";
import { getOrderById, getOrders, updateOrderStatus, updatePaymentStatus } from "../../controllers/admin/orderController.js";
import { adminAuthMiddleware, isAdmin } from "../../middlewares/adminMiddleware.js";


const router = express.Router();

router.use(adminAuthMiddleware,isAdmin)
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/payment-status", updatePaymentStatus);

export default router;