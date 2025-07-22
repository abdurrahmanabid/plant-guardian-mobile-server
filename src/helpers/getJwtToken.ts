import jwt from "jsonwebtoken";

export const getJwtToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not defined.");
  }

  return jwt.sign({ userId: userId }, jwtSecret, { expiresIn: "1d" });
};
