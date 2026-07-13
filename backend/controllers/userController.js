import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ========================================================
// 🛍️ 1. RETAIL CLIENT STOREFRONT REGISTRATION (CUSTOMER ONLY)
// ========================================================
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

    // Enforce role: 'user' strictly for all standard storefront form signups
    const user = new User({
      name: finalName,
      email: email,
      password: hashedPassword,
      cartData: cart,
      role: 'user'
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "shopper_secret_ecom_vault_2026", { expiresIn: '3d' });

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

// ========================================================
// 🛍️ 2. RETAIL CLIENT STOREFRONT SIGN-IN (CUSTOMER ONLY)
// ========================================================
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

    // 🔒 ISOLATION GUARD: Deny administrative accounts from accessing customer storefront dashboards
    if (user.role === 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Restricted Access: System Administrator credentials detected. Please authenticate via the secure Admin Portal." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password credentials." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "shopper_secret_ecom_vault_2026", { expiresIn: '3d' });

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

// ========================================================
// 🛠️ 3. ISOLATED ADMINISTRATIVE PORTAL SIGN-IN (ADMIN ONLY)
// ========================================================
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter your email and passkey credentials." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid administrative credentials." });
    }

    // 🔒 ISOLATION GUARD: Prevent standard customer shopper profiles from logging into the console hub
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Access Denied: Insufficient administrative database profile access tiers." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid administrative credentials." });
    }

    // Sign token explicitly carrying the verified administrative role marker payload
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "shopper_secret_ecom_vault_2026", 
      { expiresIn: '3d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("CRITICAL ADMIN LOGIN ENGINE CRASH:", error);
    return res.status(500).json({ success: false, message: `Server Pipeline Failure: ${error.message}` });
  }
};

// ========================================================
// 🛠️ 4. ISOLATED ADMINISTRATIVE PORTAL SIGNUP SYSTEM (ADMIN ONLY)
// ========================================================
export const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All administrative layout profile parameters required." });
    }

    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "An administrative user record with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Hardcode role: 'admin' inside document creation parameters to provision a secure entity profile
    const user = new User({
      name,
      email,
      password: hashedPassword,
      cartData: {},
      role: 'admin'
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: 'admin' }, 
      process.env.JWT_SECRET || "shopper_secret_ecom_vault_2026", 
      { expiresIn: '3d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("CRITICAL ADMIN SIGNUP ENGINE CRASH:", error);
    return res.status(500).json({ success: false, message: `Server Pipeline Failure: ${error.message}` });
  }
};

// 🛡️ 5. PROFILE CHECKPOINT CONTROLLER FUNCTION
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

// 👥 6. MASTER USER DIRECTORY STREAM CONTROLLER
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ date: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("❌ Get All Users Controller Crash Context:", error);
    res.status(500).json({ success: false, message: "Failed to read database accounts ledger vector." });
  }
};