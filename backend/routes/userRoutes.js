import express from 'express';
import { signupUser, login, getUserProfile, getAllUsers } from '../controllers/userController.js'; 
import { protectUser, protectAdmin } from '../middleware/authMiddleware.js'; 
// 🚀 FIXED: Imported the missing User model to resolve the ReferenceError crash
import User from '../models/User.js'; 

const router = express.Router();

/* ==========================================
   🔑 PUBLIC AUTH REGISTRATION ENDPOINTS
   ========================================== */
router.post('/signup', signupUser);
router.post('/login', login);

/* ==========================================
   🛡️ PROTECTED USER PROFILE ENDPOINTS
   ========================================== */
router.get('/profile', protectUser, getUserProfile);
router.get('/allusers', protectUser, protectAdmin, getAllUsers); 

/* ==========================================
   🛒 PROTECTED SHOPPING CART INTERFACES 
   ========================================== */
router.post('/getcart', protectUser, async (req, res) => {
  try {
    let userData = await User.findById(req.user._id);
    res.json({ success: true, cartData: userData.cartData });
  } catch (error) {
    console.error("Get Cart Backend Error:", error);
    res.status(500).json({ success: false, message: "Error reading cloud cart data" });
  }
});

router.post('/addtocart', protectUser, async (req, res) => {
  try {
    let userData = await User.findById(req.user._id);
    let cartData = userData.cartData || {};
    const itemId = req.body.itemId;
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    await User.findByIdAndUpdate(req.user._id, { cartData });
    res.json({ success: true, message: "Item added to cart smoothly" });
  } catch (error) {
    console.error("Add to Cart Backend Error:", error);
    res.status(500).json({ success: false, message: "Error saving item allocation" });
  }
});

router.post('/removefromcart', protectUser, async (req, res) => {
  try {
    let userData = await User.findById(req.user._id);
    let cartData = userData.cartData || {};
    const itemId = req.body.itemId;
    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
    }
    await User.findByIdAndUpdate(req.user._id, { cartData });
    res.json({ success: true, message: "Item decremented safely" });
  } catch (error) {
    console.error("Remove from Cart Backend Error:", error);
    res.status(500).json({ success: false, message: "Error wiping item allocation" });
  }
});

export default router;