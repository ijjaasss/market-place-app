import express from "express"

import { isApproveAdmin, isSeller, sellerAuthMiddleware } from "../../middlewares/sellerMiddlware.js";
import { updateSellerLogo, updateSellerPassword, updateSellerProfile } from "../../controllers/seller/profileController.js";
import upload from "../../middlewares/upload.js";


const router=express.Router()
router.use(sellerAuthMiddleware,isSeller)

router.put('/',updateSellerProfile);
router.patch('/logo', upload.fields([{ name: "logo", maxCount: 1 }]), updateSellerLogo);
router.patch('/password',updateSellerPassword);
export default router