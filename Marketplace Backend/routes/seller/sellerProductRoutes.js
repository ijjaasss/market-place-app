import express from "express"

import { isApproveAdmin, isSeller, sellerAuthMiddleware } from "../../middlewares/sellerMiddlware.js";
import upload from "../../middlewares/upload.js";
import { createSellerProduct, deleteSellerProduct, getSellerProductById, getSellerProducts, updateSellerProduct } from "../../controllers/seller/productController.js";



const router=express.Router()
router.use(sellerAuthMiddleware,isSeller,isApproveAdmin)
router.get("/",  getSellerProducts);
router.get("/:id",  getSellerProductById);

router.post("/",upload.array("images", 5),createSellerProduct);

router.put("/:id",upload.array("images", 5),updateSellerProduct);

router.delete("/:id",deleteSellerProduct);


export default router