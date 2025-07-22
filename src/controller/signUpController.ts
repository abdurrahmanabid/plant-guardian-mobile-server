import { Request, Response } from "express";
import { prisma } from "../helpers/prisma";
import { jwtToken } from "../helpers/JwtToken";
import bcrypt from "bcrypt";

export const signUpController = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Fill all the required fields" });
    }
    const SALT = process.env.SALT;

    if (!SALT) {
      throw new Error("No SALT IN E");
    }
    const SALT_ROUNDS = parseInt(SALT, 10);
    if (isNaN(SALT_ROUNDS)) {
      throw new Error("Invalid SALT_ROUNDS value in environment");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await prisma.user.create({
      data: {
        name,
        address,
        email,
        phone,
        role,
        password: hashedPassword,
      },
    });

    jwtToken(result, res); // You may want to customize this
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
