import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true, // Unique system reference string for tracking
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Links back directly to the customer account
  },
  items: [
    {
      productId: { type: Number, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      size: { type: String, required: true },     // Tracks chosen item size
      quantity: { type: Number, required: true }, // Tracks amount bought
      price: { type: Number, required: true }      // Snapshot of price at checkout
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending", // Default processing status
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;