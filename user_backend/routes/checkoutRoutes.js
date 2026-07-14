import express from "express";
import { checkout } from "../controllers/orderController.js";
import { userAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", userAuthMiddleware, checkout);

export default router;