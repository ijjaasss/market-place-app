import express from "express"

import { isApproveAdmin, isSeller, sellerAuthMiddleware } from "../../middlewares/sellerMiddlware.js";
import { getCategoriesForSeller } from "../../controllers/seller/categorieController.js";



const router=express.Router()
router.use(sellerAuthMiddleware,isSeller,isApproveAdmin)
router.get("/",getCategoriesForSeller)

export default router