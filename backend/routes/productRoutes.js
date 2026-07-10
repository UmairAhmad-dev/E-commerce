import express from "express";
import { addProduct, removeProduct, getAllProducts, getNewCollections, getPopularInMen } from "../controllers/productController.js";
import { protectUser, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Storefront View Routes
router.get("/allproducts", getAllProducts);
router.get("/newcollections", getNewCollections);
router.get("/popularinmen", getPopularInMen);

// Guarded Admin Action Routes
router.post("/addproduct", protectUser, protectAdmin, addProduct);
router.post("/removeproduct", protectUser, protectAdmin, removeProduct);

export default router;