import express from "express";
import { adminAuthMiddleware, isAdmin } from "../../middlewares/adminMiddleware.js";
import { deleteReview, getReviewById, getReviews, hideReview, unhideReview } from "../../controllers/admin/adminReviewController.js";

const router = express.Router();

router.use(adminAuthMiddleware,isAdmin);


router.get("/", getReviews);
router.get("/:id", getReviewById);
router.patch("/:id/hide", hideReview);
router.patch("/:id/unhide", unhideReview);
router.delete("/:id", deleteReview);

export default router;