import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  validateSignup,
  validateLogin,
  validateVerifyEmail,
  validateForgotPassword,
  validateResetPassword,
  handleValidationErrors,
} from "../middleware/validationMiddleware.js";
import {
  passwordResetLimiter,
  emailVerificationLimiter,
} from "../middleware/securityMiddleware.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", validateSignup, handleValidationErrors, signup);
router.post("/login", validateLogin, handleValidationErrors, login);
router.post("/logout", logout);
router.post(
  "/verify-email",
  emailVerificationLimiter,
  validateVerifyEmail,
  handleValidationErrors,
  verifyEmail
);
router.post(
  "/forgot-password",
  passwordResetLimiter,
  validateForgotPassword,
  handleValidationErrors,
  forgotPassword
);

// ✅ token harus di-decode agar aman dari karakter aneh
router.post(
  "/reset-password/:token",
  passwordResetLimiter,
  validateResetPassword,
  handleValidationErrors,
  (req, res, next) => {
    req.params.token = decodeURIComponent(req.params.token);
    next();
  },
  resetPassword
);

export default router;
