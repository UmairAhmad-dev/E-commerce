import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Guard middleware to ensure a user is logged in
export const protectUser = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from 'Bearer <token>' string layout
      token = req.headers.authorization.split(" ")[1];

      // Decode token payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the DB using decoded ID and attach it to the request object
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User profile no longer exists" });
      }

      next(); // Pass control to the next controller function safely
    } catch (error) {
      console.error("Token validation error:", error);
      res.status(401).json({ success: false, message: "Not authorized, token validation failed" });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: "Access denied, missing authentication token" });
  }
};

// Strict guard middleware to verify admin privileges
export const protectAdmin = (req, res, next) => {
  // Checks if protectUser successfully resolved the user and if their role configuration is admin
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access forbidden, administrative privileges required" });
  }
};