import express from "express"
import { adminAuthMiddleware, isAdmin } from "../../middlewares/adminMiddleware.js";
import { blockUnblockSeller, getAllSellers, getSellerById, updateSellerStatus } from "../../controllers/admin/sellersController.js";


const router=express.Router()

router.use(adminAuthMiddleware,isAdmin);
router.patch("/:id/status", updateSellerStatus);
router.patch("/:id/block",blockUnblockSeller)
router.get("/",getAllSellers)
router.get("/:id", getSellerById);


export default router