import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

// Load .env sebelum pakai process.env
dotenv.config();

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Create a CSRF token (readable by JS) for double-submit pattern
  const csrfToken = crypto.randomBytes(24).toString("hex");

  // Set JWT as httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS di production
    sameSite: "lax", // Changed from 'none' to 'lax' for better compatibility
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  // Set readable CSRF cookie so frontend can read and send it in header
  res.cookie("XSRF-TOKEN", csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Changed from 'none' to 'lax' for better compatibility
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return token;
};
