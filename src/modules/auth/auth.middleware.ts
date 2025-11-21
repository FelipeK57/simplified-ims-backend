import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthPayload {
  userId: number;
  storeId: number;
  role: string;
  email: string;
}

export interface AuthRequest extends Request {
  auth?: AuthPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token provided" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.auth = {
      userId: (decoded as any).id,
      storeId: (decoded as any).storeId,
      role: (decoded as any).role,
      email: (decoded as any).email,
    };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
