import express from "express";
import { getHome } from "../controllers/home.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getHome);

export default router;
