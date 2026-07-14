import express from 'express';
import { protectUser } from '../middleware/authMiddleware.js';
import { addReview, getProductReviews } from '../controllers/reviewController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { deleteReview, getAllReviewsAdmin } from '../controllers/reviewController.js';

const router = express.Router();

// 🛒 Client-side routes
router.post('/add', protectUser, addReview); // Post review (Requires login)
router.get('/product/:productId', getProductReviews); 
router.get('/admin/all', protectUser, protectAdmin, getAllReviewsAdmin);
router.delete('/admin/delete/:id', protectUser, protectAdmin, deleteReview);

export default router;