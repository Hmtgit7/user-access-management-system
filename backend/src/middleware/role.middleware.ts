// backend/src/middleware/role.middleware.ts
import { Request, Response, NextFunction } from "express";

type Role = "Employee" | "Manager" | "Admin";

export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};

// Convenience middleware functions for common role checks
export const isAdmin = roleMiddleware(["Admin"]);
export const isManager = roleMiddleware(["Manager", "Admin"]);
export const isEmployee = roleMiddleware(["Employee", "Manager", "Admin"]);
