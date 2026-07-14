import express from "express";
import userRoutes from "./userRoutes.js"
import productRoutes from "./productRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import cartRoutes from "./cartRoutes.js";
import wishlistRoutes from "./wishlistRoutes.js";
import checkoutRoutes from "./checkoutRoutes.js";
import orderRoutes from "./orderRoutes.js";
import reviewRoutes from "./reviewRoutes.js";

const router=express.Router();
router.get('/',(req,res)=>{
    res.json({message:"Welcome to the User API"});
})
router.use("/user", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);

export default router;