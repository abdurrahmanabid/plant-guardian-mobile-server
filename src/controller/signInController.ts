import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../helpers/prisma";
import { jwtToken } from "../helpers/JwtToken";

export const signInController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "fill all the required fields" });
    }
    const user: any = await prisma.user.findUnique({
      where: { email },
    });
    const hashPass = await bcrypt.compare(password, user.password);
    if (hashPass) {
      jwtToken(user, res);
    } else {
      res.status(402).json({ message: "Incorrect Password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
