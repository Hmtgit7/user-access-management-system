// src/routes/request.routes.ts
import { Router } from "express";
import {
  createRequest,
  getUserRequests,
  getPendingRequests,
  getRequestById,
  updateRequestStatus,
} from "../controllers/request.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isEmployee, isManager } from "../middleware/role.middleware";

const router = Router();

// Manager routes - only users with Manager or Admin role can access
// IMPORTANT: Place specific routes BEFORE parameterized routes to avoid conflicts
router.get("/pending", authMiddleware, isManager, getPendingRequests);

// Employee routes - any authenticated user with Employee role or higher can access
router.post("/", authMiddleware, isEmployee, createRequest);
router.get("/my-requests", authMiddleware, isEmployee, getUserRequests);

// IMPORTANT: Always put parameterized routes LAST
router.get("/:id", authMiddleware, isEmployee, getRequestById);
router.patch("/:id/status", authMiddleware, isManager, updateRequestStatus);

export default router;
