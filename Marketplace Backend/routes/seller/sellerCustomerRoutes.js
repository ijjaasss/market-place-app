import express from "express"

import { isApproveAdmin, isSeller, sellerAuthMiddleware } from "../../middlewares/sellerMiddlware.js";
import { getCustomerDetails, getSellerCustomers } from "../../controllers/seller/customerController.js";



const router=express.Router()
router.use(sellerAuthMiddleware,isSeller,isApproveAdmin)

router.get("/",  getSellerCustomers);
router.get("/:id",  getCustomerDetails);
export default router