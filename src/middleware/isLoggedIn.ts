import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../helpers/prisma";
type DecodedToken = {
  userId: string;
};
export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Prefer Authorization: Bearer <token>; fallback to cookie
  const authHeader = req.headers.authorization || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const token = bearer || req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Please Login/Signup" });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Secret Is Not Exists!");
  }
  const decoded = jwt.verify(token, secret) as DecodedToken;
  if (!decoded.userId) {
    return res.status(401).json({ message: "Please Login/Signup" });
  }
  const result = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });
  if (result) {
    next();
  } else {
    res.status(404).json({ message: "No user found, Please Register User" });
  }
};
