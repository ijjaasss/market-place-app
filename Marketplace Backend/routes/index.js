import express from "express"
import SellerRoutes from "./sellerRoutes.js"
import AdminRoutes from "./adminRoutes.js"
const router = express.Router()
router.get('/',(req,res)=>{
    res.json({message:"Welcome to the Marketplace Backend API"})
})
router.use('/seller',SellerRoutes)
router.use('/admin',AdminRoutes)
export default router