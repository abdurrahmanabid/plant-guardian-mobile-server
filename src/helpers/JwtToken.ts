import { CookieOptions, NextFunction, Response } from "express";
import { getJwtToken } from "./getJwtToken";

export const jwtToken = (user: any, res: Response) => {
  try {
    const token = getJwtToken(user.id);

    // Set cookie expiration to match the token's expiration
    const expiresIn = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    const isProd = process.env.NODE_ENV === "production";
    const options: CookieOptions = {
      expires: new Date(Date.now() + expiresIn),
      httpOnly: true,
      // Cross-site cookies (frontend on Vercel) require both:
      //   sameSite: 'none' AND secure: true
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
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
    res
      .status(500)
      .json({ success: false, message: "Failed to generate token" });
  }
};
