// src/routes/software.routes.ts
import { Router } from "express";
import {
  getAllSoftware,
  getSoftwareById,
  createSoftware,
  updateSoftware,
  deleteSoftware,
} from "../controllers/software.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/role.middleware";

const router = Router();

// Protected routes - require authentication
router.get("/", authMiddleware, getAllSoftware);
router.get("/:id", authMiddleware, getSoftwareById);

// Admin-only routes
router.post("/", authMiddleware, isAdmin, createSoftware);
router.put("/:id", authMiddleware, isAdmin, updateSoftware);
router.delete("/:id", authMiddleware, isAdmin, deleteSoftware);

export default router;
