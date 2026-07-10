import mongoose from "mongoose";

// Define the blueprint structural constraints for a product listing
const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true, // Guarantees no two products share the same SKU sequence
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String, // We will store the static hosted image URL string here
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically timestamps exactly when the product was published
  },
  available: {
    type: Boolean,
    default: true, // Defaults to 'In Stock' when first uploaded
  },
});

// Compile the blueprint schema model container block
const Product = mongoose.model("Product", productSchema);

export default Product;