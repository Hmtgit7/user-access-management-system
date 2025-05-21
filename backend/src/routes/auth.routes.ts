// src/routes/auth.routes.ts
import { Router } from "express";
import { signup, login, getCurrentUser } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/me", authMiddleware, getCurrentUser);

export default router;
