// backend/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./db/connectDb.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import path from "path";
import {
  securityHeaders,
  generalLimiter,
  authLimiter,
} from "./middleware/securityMiddleware.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// ===== Security Headers =====
app.use(securityHeaders);

// ===== CORS Configuration =====
app.use(
  cors({
    origin: process.env.CLIENT_URL, // FE URL
    credentials: true,
  })
);

// health check endpoint
app.get("/health", (_req, res) => {
  const dbReady = mongoose.connection?.readyState; // 1 means connected
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: dbReady === 1 ? "Connected" : "Disconnected"
  });
});

// ===== Trust proxy for HTTPS =====
app.set("trust proxy", 1);

// ===== Rate Limiting =====
app.use(generalLimiter);

// ===== Body & Cookie parsers with size limits =====
app.use(express.json({ limit: "10kb" })); // Prevent large payload DoS
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ===== API routes =====
app.use("/api/auth", authLimiter, authRoutes);

// ===== Static SPA (opsional, jika kamu juga host FE di server yang sama) =====

app.use(express.static(path.join(__dirname, "frontend/dist")));

// Layani semua route non-API ke index.html (SPA)
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 5000; // bisa dari env atau default 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connectDb();
export default (req, res) => app(req, res);
