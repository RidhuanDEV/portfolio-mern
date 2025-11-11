import express from 'express';
import { getProyek } from '../controllers/proyek.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

router.get('/proyek', verifyToken, getProyek);
router.post('/proyek', verifyToken, createProyek);
export default router;