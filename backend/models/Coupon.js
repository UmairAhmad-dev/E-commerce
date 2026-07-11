import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true, // Guarantees all codes are saved in uppercase (e.g., EID2026)
    trim: true
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
    default: "percentage"
  },
  discountValue: {
    type: Number,
    required: true // e.g., 20 for 20% off, or 15 for $15 off
  },
  minOrderAmount: {
    type: Number,
    default: 0 // Minimum basket bill required to use this promo code
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;