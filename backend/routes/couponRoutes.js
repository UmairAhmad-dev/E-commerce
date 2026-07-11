import express from 'express';
import { protectUser, protectAdmin } from '../middleware/authMiddleware.js';
import { addCoupon, getAllCoupons, removeCoupon } from '../controllers/couponController.js';

const router = express.Router();

router.get('/allcoupons', protectUser, protectAdmin, getAllCoupons);
router.post('/addcoupon', protectUser, protectAdmin, addCoupon);
router.post('/removecoupon', protectUser, protectAdmin, removeCoupon);

export default router;