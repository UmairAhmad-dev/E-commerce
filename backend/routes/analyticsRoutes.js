import express from 'express';
import { protectUser, protectAdmin } from '../middleware/authMiddleware.js';
import { getDashboardAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/dashboard', protectUser, protectAdmin, getDashboardAnalytics);

export default router;