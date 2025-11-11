import express from 'express';
import { getAbout } from '../controllers/about.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';


const router = express.Router();
router.get('/about', verifyToken, getAbout);