import { Request, Response } from "express";
import { prisma } from "../helpers/prisma";
import { jwtToken } from "../helpers/JwtToken";

export const signUpController = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, password, role } = req.body;
    if (!name || !email || !phone || !password) {
      res.status(400).json({ message: "fill all the required fields" });
    }
    const result = await prisma.user.create({
      data: {
        name,
        address,
        email,
        phone,
        role,
        password,
      },
    });
    jwtToken(result, res);
  } catch (error) {
    res.status(500).json(error);
  }
};
