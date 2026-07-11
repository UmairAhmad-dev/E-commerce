import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// @desc    Fetch aggregated business metrics for the admin overview dashboard
// @route   GET /api/analytics/dashboard
export const getDashboardAnalytics = async (req, res) => {
  try {
    // 1. Fetch total counts across operational documents
    const totalProducts = await Product.countDocuments({});
    const totalUsers = await User.countDocuments({ role: "user" });
    
    // 2. Fetch all completed/delivered orders to compute absolute revenue totals safely
    const orders = await Order.find({});
    const totalOrders = orders.length;
    
    const totalRevenue = orders.reduce((sum, order) => {
      // Only count revenue from orders that aren't cancelled
      return order.status !== "Cancelled" ? sum + (order.totalAmount || 0) : sum;
    }, 0);

    // 3. Compute Category Distribution Metrics dynamically for chart blocks
    const categoryMetrics = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // 🛡️ Matches your database categories ("mens", "womens", "kids") exactly
    const distribution = { men: 0, women: 0, kid: 0 };
    
    categoryMetrics.forEach(metric => {
      const categoryKey = metric._id ? metric._id.toLowerCase().trim() : "";
      
      // Dynamic cross-mapping logic to bridge DB collections with frontend state expectations
      if (categoryKey === "mens" || categoryKey === "men") {
        distribution.men = metric.count;
      } else if (categoryKey === "womens" || categoryKey === "women") {
        distribution.women = metric.count;
      } else if (categoryKey === "kids" || categoryKey === "kid") {
        distribution.kid = metric.count;
      }
    });

    console.log("📊 Analytics Pipeline: Dashboard business summaries successfully calculated.");
    res.json({
      success: true,
      metrics: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        distribution
      }
    });
  } catch (error) {
    console.error("❌ Analytics Engine Controller Error:", error);
    res.status(500).json({ success: false, message: "Database analytics computation failure" });
  }
};