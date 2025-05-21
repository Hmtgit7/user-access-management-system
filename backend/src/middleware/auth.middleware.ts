// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "No authorization header provided" });
      return;
    }

    const parts = authHeader.split(" ");

    // Check format: "Bearer [token]"
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(401).json({
        message: "Authorization header format must be 'Bearer [token]'",
      });
      return;
    }

    const token = parts[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    try {
      const decodedToken = verifyToken(token);
      req.user = decodedToken;
      next();
    } catch (err) {
      // Handle token verification errors
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
