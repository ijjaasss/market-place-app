import express from "express"
import { adminAuthMiddleware, isAdmin } from "../../middlewares/adminMiddleware.js";
import { deleteAdminProduct, getAdminProductById, getAdminProducts, updateProductStatus } from "../../controllers/admin/ProductController.js";


const router=express.Router()

router.use(adminAuthMiddleware,isAdmin);
router.get("/",getAdminProducts)
router.get("/:id",getAdminProductById)
router.patch("/:id/status", updateProductStatus);
router.patch("/:id/delete",deleteAdminProduct)

export default router