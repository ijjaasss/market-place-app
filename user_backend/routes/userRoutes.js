import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from "../controllers/userController.js";
import { userAuthMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", userAuthMiddleware, logoutUser);
router.get('/me',userAuthMiddleware,getUserProfile)
export default router;