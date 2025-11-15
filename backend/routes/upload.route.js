import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadFile } from "../controllers/upload.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Upload file (images to Cloudinary, CV handled separately in home controller)
router.post("/upload", verifyToken, upload.single("file"), uploadFile);

export default router;
