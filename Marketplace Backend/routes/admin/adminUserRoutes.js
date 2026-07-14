import express from "express";
import { adminAuthMiddleware, isAdmin } from "../../middlewares/adminMiddleware.js";
import { getUserById, getUsers, updateUserStatus } from "../../controllers/admin/adminUserController.js";




const router = express.Router();

router.use(adminAuthMiddleware,isAdmin);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id/status", updateUserStatus);

export default router;