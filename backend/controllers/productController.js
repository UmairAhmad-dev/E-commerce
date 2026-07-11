import Product from "../models/Product.js";

// @desc    Ingest and save a new product to MongoDB
// @route   POST /api/products/addproduct
export const addProduct = async (req, res) => {
  try {
    let products = await Product.find({});
    let id;
    
    if (products.length > 0) {
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id + 1;
    } else {
      id = 1;
    }

    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      // ✅ Ensures brand new products launch with an initial default size-stock matrix if not explicitly passed
      size_stock: req.body.size_stock || { S: 0, M: 0, L: 0, XL: 0 }
    });

    await product.save();
    console.log(`📦 DB Success: Product saved successfully -> ${product.name}`);
    
    res.json({ 
      success: true, 
      name: req.body.name 
    });
    
  } catch (error) {
    console.error("❌ Add Product Error Context:", error);
    res.status(500).json({ 
      success: false, 
      message: "Database insertion pipeline failure" 
    });
  }
};

// @desc    Purge and erase an item from MongoDB by ID SKU reference
// @route   POST /api/products/removeproduct
export const removeProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.body.id });
    
    if (!deletedProduct) {
      return res.status(404).json({ 
        success: false, 
        message: "No product matches the requested ID sequence" 
      });
    }

    console.log(`🗑️ DB Success: Product SKU-${req.body.id} has been fully deleted.`);
    
    res.json({ 
      success: true, 
      message: "Product removed successfully" 
    });
    
  } catch (error) {
    console.error("❌ Remove Product Error Context:", error);
    res.status(500).json({ 
      success: false, 
      message: "Database deletion pipeline failure" 
    });
  }
};

// @desc    Update an item's prices and per-size stock matrix inside MongoDB
// @route   POST /api/products/updateproduct
export const updateProduct = async (req, res) => {
  try {
    const { id, old_price, new_price, size_stock } = req.body;

    // Locates product doc matching unique numeric id configuration key and overwrites modifications
    const updatedProduct = await Product.findOneAndUpdate(
      { id: id },
      {
        old_price: Number(old_price),
        new_price: Number(new_price),
        size_stock: size_stock
      },
      { new: true } // Tells mongoose to return back the freshly modified version document
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "SKU reference identifier missing from database records."
      });
    }

    console.log(`💾 DB Success: Product SKU-${id} inventory metadata metrics updated cleanly.`);
    
    res.json({
      success: true,
      message: "Inventory catalog details and pricing metrics synced clean!"
    });

  } catch (error) {
    console.error("❌ Update Product Transaction Error:", error);
    res.status(500).json({
      success: false,
      message: "Database update transaction exception handler breakdown"
    });
  }
};

// @desc    Fetch all products from MongoDB database collection
// @route   GET /api/products/allproducts
export const getAllProducts = async (req, res) => {
  try {
    let products = await Product.find({});
    console.log(`🔍 DB Read: Retrieved ${products.length} products from the catalog.`);
    
    res.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error("❌ Fetch All Products Error:", error);
    res.status(500).json({ success: false, message: "Database read failure" });
  }
};

// @desc    Get latest added products for New Collections section
// @route   GET /api/products/newcollections
export const getNewCollections = async (req, res) => {
  try {
    let products = await Product.find({});
    let newcollections = products.slice(-8);
    console.log("🔍 DB Read: Retrieved latest 8 collection entries.");
    
    res.json({
      success: true,
      products: newcollections
    });
  } catch (error) {
    console.error("❌ New Collections Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching collections" });
  }
};

// @desc    Get popular products in the men's category
// @route   GET /api/products/popularinmen
export const getPopularInMen = async (req, res) => {
  try {
    let products = await Product.find({ category: "mens" });
    let popular_in_men = products.slice(0, 4);
    
    res.json({
      success: true,
      products: popular_in_men
    });
  } catch (error) {
    console.error("❌ Popular Items Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching popular items" });
  }
};