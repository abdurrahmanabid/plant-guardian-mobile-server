import { Request } from "express";
import jwt from "jsonwebtoken";
export const getUserId = (req: Request): string => {
  const token = req.cookies.token;
  const secret = process.env.JWT_SECRET;
  if (!token) {
    throw new Error("Secret Are not Defined");
  } else {
    if (!secret) {
      throw new Error("Secret Are not Defined");
    }
    const decoded = jwt.verify(token, secret) as { userId: string };
    return decoded.userId;
  }
};
