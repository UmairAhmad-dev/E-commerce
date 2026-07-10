import express from "express";
import { signupUser, loginUser, addToCart, removeFromCart, getCart } from "../controllers/userController.js";
import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication Endpoints
router.post("/signup", signupUser);
router.post("/login", loginUser);

// Database Shopping Cart Interaction Endpoints (Protected by User Auth Verification)
router.post("/addtocart", protectUser, addToCart);
router.post("/removefromcart", protectUser, removeFromCart);
router.get("/getcart", protectUser, getCart);

export default router;