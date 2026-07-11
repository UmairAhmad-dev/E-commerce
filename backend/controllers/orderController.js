import Order from "../models/Order.js";

// @desc    Create and store a new customer purchase log document
// @route   POST /api/orders/placeorder
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    
    // 1. Generate a unique 6-digit random string for tracking references
    const orderId = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 2. Extract the verified user ID injected by your protectUser auth middleware guard
    const userId = req.user._id; 

    // 3. Instantiate the model document matching your mongoose Schema rules exactly
    const newOrder = new Order({
      orderId,
      userId,
      items,
      totalAmount,
      shippingAddress
    });

    // 4. Save to MongoDB
    await newOrder.save();
    console.log(`💾 MongoDB Success: Order document #${orderId} successfully committed to collection.`);
    
    res.status(201).json({
      success: true,
      message: "Order recorded successfully",
      orderId
    });
  } catch (error) {
    console.error("❌ Backend Order Placement Controller Error:", error);
    res.status(500).json({ success: false, message: "Internal server order processing error" });
  }
};

// @desc    Fetch all customer orders for administration management
// @route   GET /api/orders/allorders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ date: -1 }); // Newest orders first
    console.log(`📦 DB Read: Retrieved ${orders.length} orders from terminal logs.`);
    res.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Fetch Orders Controller Error:", error);
    res.status(500).json({ success: false, message: "Database read failure" });
  }
};

// @desc    Update order status timeline state
// @route   POST /api/orders/updatestatus
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { status: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order document sequence missing" });
    }

    console.log(`🚚 DB Success: Order #${orderId} state bumped to -> ${status}`);
    res.json({ success: true, message: `Order status shifted to ${status} successfully!` });
  } catch (error) {
    console.error("❌ Update Status Controller Error:", error);
    res.status(500).json({ success: false, message: "Database write failure" });
  }
};