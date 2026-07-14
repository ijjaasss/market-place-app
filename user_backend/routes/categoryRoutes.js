import express from "express";
import { getCategories, getProductsByCategory } from "../controllers/categoryController.js";
import { optionalAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id/products",optionalAuth, getProductsByCategory);
export default router;