import { NextFunction, Request, Response } from "express";

// user logout
export const signout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .clearCookie("token")
    .json({ status: "Logout", message: "Logout successful" });
};
