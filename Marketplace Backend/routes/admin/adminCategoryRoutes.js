import express from "express"
import { adminAuthMiddleware, isAdmin } from "../../middlewares/adminMiddleware.js";
import { getCategories, getCategoryById, toggleCategoryStatus, updateCategory } from "../../controllers/admin/categoriesController.js";
import upload from "../../middlewares/upload.js";



const router=express.Router()

router.use(adminAuthMiddleware,isAdmin);
router.get('/',getCategories)
router.get('/:id',getCategoryById)
router.put("/:id",upload.single("image"),updateCategory)
router.patch("/:id/status",toggleCategoryStatus)


export default router