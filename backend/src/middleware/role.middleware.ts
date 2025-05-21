// backend/src/middleware/role.middleware.ts
import { Request, Response, NextFunction } from "express";

type Role = "Employee" | "Manager" | "Admin";

export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }

    next();
  };
};

// Convenience middleware functions for common role checks
export const isAdmin = roleMiddleware(["Admin"]);
export const isManager = roleMiddleware(["Manager", "Admin"]);
export const isEmployee = roleMiddleware(["Employee", "Manager", "Admin"]);
