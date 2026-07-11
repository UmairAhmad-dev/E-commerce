import express from 'express';
import { protectUser, protectAdmin } from '../middleware/authMiddleware.js';
// 👇 Added updateProduct to your imported controller matrix module
import { 
  getAllProducts, 
  addProduct, 
  removeProduct, 
  updateProduct,
  getNewCollections, 
  getPopularInMen 
} from '../controllers/productController.js';

const router = express.Router();

// 🟢 PUBLIC CATALOG ROUTES
router.get('/allproducts', getAllProducts);
router.get('/newcollections', getNewCollections); 
router.get('/popularinmen', getPopularInMen);     

// 🔒 PROTECTED ADMINISTRATION ENDPOINTS
router.post('/addproduct', protectUser, protectAdmin, addProduct);
router.post('/removeproduct', protectUser, protectAdmin, removeProduct);
router.post('/updateproduct', protectUser, protectAdmin, updateProduct); // 🌟 Added: Secure Price & Per-Size Stock Updates

export default router;