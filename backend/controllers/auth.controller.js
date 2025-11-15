import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    // Input validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields (email, password, name) are required",
      });
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password with strong rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate secure verification token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      // Auto-verify in development mode for testing
      isVerified: process.env.NODE_ENV === "development",
    });

    await user.save();

    // Set JWT token
    generateTokenAndSetCookie(res, user._id);

    // Send verification email (non-blocking - don't fail signup if email fails)
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      console.error(
        "Warning: Failed to send verification email:",
        emailError.message
      );
      // In development, still allow signup if email fails
      // In production, this should be handled differently (queue, retry, etc)
      if (process.env.NODE_ENV === "production") {
        throw emailError;
      }
    }

    res.status(201).json({
      success: true,
      message: "Account created successfully. Please verify your email.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    // Avoid exposing internal errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Log error untuk debugging (jangan expose ke client)
    console.error("Signup error:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred during signup",
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying email",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // Generic error message untuk prevent user enumeration
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if email is verified (skip in development mode for testing)
    if (!user.isVerified && process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};

export const logout = async (req, res) => {
  //handle logout logic
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS di production
    sameSite: "lax",
    path: "/", // path wajib sama seperti saat set cookie
  });

  // Clear readable CSRF cookie as well
  res.clearCookie("XSRF-TOKEN", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // SECURITY: Return generic message apakah user ada atau tidak (prevent user enumeration)
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account exists, a password reset email will be sent",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    // Return generic success message
    res.status(200).json({
      success: true,
      message: "If an account exists, a password reset email will be sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }, // gt = greater than
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while resetting password",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // Pastikan req.userId sudah ada (misal lewat middleware auth)
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Select only safe fields at database level (extra security)
    // ✅ Use ONLY exclusion to avoid MongoDB projection conflict
    const user = await User.findById(req.userId).select(
      "-password -verificationToken -verificationTokenExpiresAt -resetPasswordToken -resetPasswordExpiresAt -__v -updatedAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication check failed",
    });
  }
};
