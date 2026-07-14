import express from "express"
import {   getAdminDashboard,  getAdminProfile,   loginAdmin } from "../controllers/AdminController.js"
import { adminAuthMiddleware, isAdmin } from "../middlewares/adminMiddleware.js"
import { Logout } from "../controllers/PublicController.js"
import upload from "../middlewares/upload.js"
import adminUser from "./admin/adminUserRoutes.js"
import adminProduct from "./admin/adminProductRoutes.js"
import adminCategories from "./admin/adminCategoryRoutes.js"
import adminSeller from "./admin/adminSellersRoutes.js"
import adminOrderRoutes from "./admin/adminOrderRoutes.js"
import adminWithdrawalRoutes  from "./admin/adminWithdrawalRoutes.js"
import adminReviewRoutes from "./admin/adminReviewRoutes.js"
const router=express.Router()

router.post('/login',loginAdmin)
router.post('/logout',Logout)

router.get('/me',adminAuthMiddleware,isAdmin,getAdminProfile)
router.get('/dashboard',adminAuthMiddleware,isAdmin,getAdminDashboard)

router.use("/orders", adminOrderRoutes);
router.use("/sellers",adminSeller)
router.use("/categories",adminCategories)
router.use("/user",adminUser)
router.use("/product" ,adminProduct)
router.use("/withdrawals", adminWithdrawalRoutes);
router.use("/reviews",adminReviewRoutes)
export default router