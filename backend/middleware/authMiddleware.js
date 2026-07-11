import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Guard middleware to ensure a user is logged in
export const protectUser = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from 'Bearer <token>' string layout
      token = req.headers.authorization.split(" ")[1];

      // Decode token payload with explicit fallback signature key matching userController
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "shopper_secret_ecom_vault_2026");

      // Fetch the user from the DB using decoded ID and attach it to the request object
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User profile no longer exists" });
      }

      return next(); // ✅ Added return keyword to halt function block execution line immediately!
    } catch (error) {
      console.error("Token validation error:", error);
      return res.status(401).json({ success: false, message: "Not authorized, token validation failed" }); // ✅ Added return
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied, missing authentication token" }); // ✅ Added return
  }
};

// Strict guard middleware to verify admin privileges
export const protectAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next(); // ✅ Added return here for explicit control safety
  } else {
    return res.status(403).json({ success: false, message: "Access forbidden, administrative privileges required" }); // ✅ Added return
  }
};