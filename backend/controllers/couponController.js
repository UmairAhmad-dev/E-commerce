import Coupon from "../models/Coupon.js";

// @desc    Create a new marketing coupon campaign
// @route   POST /api/coupons/addcoupon
export const addCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, expiryDate } = req.body;

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ success: false, message: "Coupon code already exists." });
    }

    const coupon = new Coupon({
      code,
      discountType,
      discountValue,
      minOrderAmount,
      expiryDate
    });

    await coupon.save();
    console.log(`🎫 DB Success: Coupon campaign ${coupon.code} created.`);
    res.json({ success: true, message: "Coupon created successfully!" });
  } catch (error) {
    console.error("❌ Add Coupon Controller Error:", error);
    res.status(500).json({ success: false, message: "Server error creating coupon" });
  }
};

// @desc    Get all campaign coupons
// @route   GET /api/coupons/allcoupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ dateCreated: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    console.error("❌ Get Coupons Controller Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching coupons" });
  }
};

// @desc    Delete a coupon code reference
// @route   POST /api/coupons/removecoupon
export const removeCoupon = async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.body.id);
    if (!deletedCoupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    console.log(`🗑️ DB Success: Coupon reference scrubbed.`);
    res.json({ success: true, message: "Coupon removed successfully" });
  } catch (error) {
    console.error("❌ Remove Coupon Controller Error:", error);
    res.status(500).json({ success: false, message: "Server error erasing coupon" });
  }
};