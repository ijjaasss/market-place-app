import express from "express";
import {
  getProducts,
  getProductById,
} from "../controllers/productController.js";
import { optionalAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/",optionalAuth, getProducts);
router.get("/:id", optionalAuth,getProductById);

export default router;