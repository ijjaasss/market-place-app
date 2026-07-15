import express from "express"
import {  getSellerDashboard,   getSellerProfile, loginSeller, registerSeller } from "../controllers/SellerController.js"
import upload from "../middlewares/upload.js"
import { isApproveAdmin, isSeller, sellerAuthMiddleware } from "../middlewares/sellerMiddlware.js"
import { LogoutSeller } from "../controllers/PublicController.js"
import sellerProductRoute from "./seller/sellerProductRoutes.js"
import sellerCategorieRoutes from "./seller/sellerCategorieRoutes.js"
import sellrOrderRoutes from "./seller/sellerOrderRoutes.js"
import sellerCustomer from "./seller/sellerCustomerRoutes.js"
import sellerWithdrawalRoute from "./seller/sellerWithdrawalsRoutes.js"
import sellerProfileRoutes from "./seller/sellerProfileRoutes.js"
import sellerReviewRoutes from "./seller/sellerReviewRoutes.js";
const router=express.Router()
router.post('/register',
      upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
    ]),
    registerSeller)

router.post('/login',loginSeller)
router.get('/me',sellerAuthMiddleware,isSeller,getSellerProfile)
router.post('/logout',LogoutSeller)
router.get("/dashboard",sellerAuthMiddleware,isSeller,getSellerDashboard)
router.use('/products',sellerProductRoute)
router.use("/categories",sellerCategorieRoutes)
router.use("/orders",sellrOrderRoutes)
router.use("/customers",sellerCustomer)
router.use("/withdrawals", sellerWithdrawalRoute);
router.use("/profile",sellerProfileRoutes)


router.use("/reviews", sellerReviewRoutes);
export default router