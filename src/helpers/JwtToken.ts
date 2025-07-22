import { NextFunction, Response } from "express";
import { getJwtToken } from "./getJwtToken";

export const jwtToken = (user: any, res: Response) => {
  try {
    const token = getJwtToken(user.id);

    // Set cookie expiration to match the token's expiration
    const expiresIn = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    const options: { expires: Date; httpOnly: boolean } = {
      expires: new Date(Date.now() + expiresIn),  // Token and cookie expire after 1 day
      httpOnly: true, // Prevent client-side access to the cookie
    };

    // Remove sensitive data (e.g., password)
    user.password = undefined;

    // Send the token as a cookie with the response
    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to generate token" });
  }
};
