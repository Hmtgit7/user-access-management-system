// src/utils/jwt.ts
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = "24h";

export interface TokenPayload {
  userId: number;
  username: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Validate that the decoded token has the expected shape
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      "username" in decoded &&
      "role" in decoded
    ) {
      return decoded as TokenPayload;
    }

    throw new Error("Invalid token payload structure");
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error("Invalid token");
  }
};
