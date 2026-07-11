import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import orderRouter from "./routes/orderRoutes.js";

// Import MVC Routers
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Global Middleware Engine Configurations
app.use(express.json());
app.use(cors());

// Live Database Connection Pipeline
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/shopper")
  .then(() => console.log("💾 MongoDB Cluster connected successfully!"))
  .catch((err) => console.error(`❌ Database connection failure: ${err}`));

/* ==========================================
   🛣️ APPLICATION ROUTE MODULE MOUNTING
   ========================================== */
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders",orderRouter);

/* ==========================================
   🖼️ MULTER MEDIA UPLOAD COMPONENT MATRIX
   ========================================== */

// Configure disk storage parameters for image files
const storage = multer.diskStorage({
  destination: "./upload/images", // Saves files cleanly to an images sub-folder
  filename: (req, file, cb) => {
    // Appends a unique timestamp suffix so no two uploads overwrite each other
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Expose the upload storage directory statically so images can be fetched via standard links
app.use("/images", express.static("upload/images"));

// API Endpoint for Image Upload Execution
app.post("/api/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image file provided" });
  }
  res.json({
    success: true,
    image_url: `http://localhost:${PORT}/images/${req.file.filename}` // Returns the live host URL string!
  });
});

// Root Diagnostic Endpoint Route
app.get("/", (req, res) => {
  res.send("SHOPPER Master API Server Engine Is Running Safely!");
});

// Start listening execution
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`🚀 Clean MVC API Server running on: http://localhost:${PORT}`);
  } else {
    console.error(`❌ Fatal Error: ${error}`);
  }
});