import express from 'express';
import { protectUser, protectAdmin } from '../middleware/authMiddleware.js';
import { getAllOrders, updateOrderStatus, placeOrder } from '../controllers/orderController.js';

const router = express.Router();

// 🛒 Client-side Customer Checkout Placement Endpoint (Requires valid login profile token)
router.post('/placeorder', protectUser, placeOrder);

// 🛡️ Administrative Control Panel Queue Sync Endpoints (Requires admin validation clearance)
router.get('/allorders', protectUser, protectAdmin, getAllOrders);
router.post('/updatestatus', protectUser, protectAdmin, updateOrderStatus);

export default router;