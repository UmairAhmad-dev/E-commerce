import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 📝 1. SIGNUP CONTROLLER FUNCTION
export const signupUser = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const finalName = username || name; 

    if (!finalName || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all required inputs (Name, Email, Password)." });
    }

    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "An account with this email address already exists." });
    }

    let cart = {};
    for (let i = 0; i < 301; i++) { 
      cart[i] = 0; 
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: finalName,
      email: email,
      password: hashedPassword,
      cartData: cart,
      role: 'user'
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "shopper_secret_ecom_vault_2026", { expiresIn: '3d' });

    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("CRITICAL SIGNUP LOG ENGINE CRASH:", error);
    return res.status(500).json({ success: false, message: `Server Pipeline Failure: ${error.message}` });
  }
};

// 🔑 2. LOGIN CONTROLLER FUNCTION
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter your email and password credentials." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "shopper_secret_ecom_vault_2026", { expiresIn: '3d' });

    return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("CRITICAL LOGIN LOG ENGINE CRASH:", error);
    return res.status(500).json({ success: false, message: `Server Pipeline Failure: ${error.message}` });
  }
};

// 🛡️ 3. PROFILE CHECKPOINT CONTROLLER FUNCTION
export const getUserProfile = async (req, res) => {
  try {
    if (req.user) {
      return res.json({ 
        success: true, 
        role: req.user.role, 
        name: req.user.name 
      });
    } else {
      return res.status(404).json({ success: false, message: "User profile reference missing." });
    }
  } catch (error) {
    console.error("❌ Profile Retrieval Pipeline Failure:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 👥 4. MASTER USER DIRECTORY STREAM CONTROLLER
// ✅ NEW: Compiles and extracts all customer profiles securely from the database indexes
export const getAllUsers = async (req, res) => {
  try {
    // Queries all user records, dropping password strings from the payload for top tier security
    const users = await User.find({}).select("-password").sort({ date: -1 });
    console.log(`👥 DB Success: Extracted ${users.length} registration documents from collections.`);
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("❌ Get All Users Controller Crash Context:", error);
    res.status(500).json({ success: false, message: "Failed to read database accounts ledger vector." });
  }
};