import express from "express";
import { adminAuthMiddleware, isAdmin } from "../../middlewares/adminMiddleware.js";
import { approveWithdrawal, getWithdrawalById, getWithdrawals, payWithdrawal, rejectWithdrawal } from "../../controllers/admin/adminWithdrawalController.js";

const router = express.Router();

router.use(adminAuthMiddleware,isAdmin);

router.get("/", getWithdrawals);
router.get("/:id", getWithdrawalById);
router.patch("/:id/approve", approveWithdrawal);
router.patch("/:id/reject", rejectWithdrawal);
router.patch("/:id/pay", payWithdrawal);

export default router;