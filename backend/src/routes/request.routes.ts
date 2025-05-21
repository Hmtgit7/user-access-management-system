// backend/src/routes/request.routes.ts
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

// Employee routes
router.post("/", authMiddleware, isEmployee, createRequest);
router.get("/my-requests", authMiddleware, isEmployee, getUserRequests);
router.get("/:id", authMiddleware, isEmployee, getRequestById);

// Manager routes
router.get("/pending", authMiddleware, isManager, getPendingRequests);
router.patch("/:id/status", authMiddleware, isManager, updateRequestStatus);

export default router;
