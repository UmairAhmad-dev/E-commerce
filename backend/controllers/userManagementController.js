import User from "../models/User.js";
import Order from "../models/Order.js";

// @desc    Fetch all registered users with dynamic order counters and total revenue metrics
// @route   GET /api/users/allusers
export const getAllUsersWithMetrics = async (req, res) => {
  try {
    // Fetch all users except their passwords
    const users = await User.find({}).select("-password");

    // Map through users to dynamically aggregate lifetime order stats from the Order collection
    const usersWithMetrics = await Promise.all(
      users.map(async (user) => {
        // Find all orders matching this user's unique MongoDB ObjectId identifier
        const userOrders = await Order.find({ userId: user._id });

        const dynamicOrders = userOrders.length;
        const spent = userOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Map access tier label based on database roles or spent thresholds
        let access = user.role === "admin" ? "Admin" : "Customer";
        if (user.role !== "admin" && spent > 500) {
          access = "VIP Customer";
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          dynamicOrders,
          spent,
          access
        };
      })
    );

    console.log(`👤 DB Read: Compiled analytics matrix metrics for ${usersWithMetrics.length} user profiles.`);
    res.json({ success: true, users: usersWithMetrics });
  } catch (error) {
    console.error("❌ User Management Metrics Controller Error:", error);
    res.status(500).json({ success: false, message: "Database user aggregation pipeline failure" });
  }
};