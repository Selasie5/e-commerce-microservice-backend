import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Extend the Request type to include userId
export interface AuthenticatedRequest extends Request {
  userId?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access token missing or invalid" });
    return; // Add `return` to stop execution
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId; // Attach userId to the request object
    next(); // Call the next middleware
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
    return; // Add `return` to stop execution
  }
};
