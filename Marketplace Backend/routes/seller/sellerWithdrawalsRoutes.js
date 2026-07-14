import express from "express"

import { isApproveAdmin, isSeller, sellerAuthMiddleware } from "../../middlewares/sellerMiddlware.js";

import { getSellerWithdrawals, requestWithdrawal } from "../../controllers/seller/WithdrawalController.js";


const router=express.Router()
router.use(sellerAuthMiddleware,isSeller,isApproveAdmin)

router.get("/",getSellerWithdrawals)
router.post("/",requestWithdrawal)

export default router