import express from "express";
import { register, login, getProfile } from "../controller/userController";
import { authenticateToken } from "../../../api-gateway/middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateToken, getProfile);

export default router;
