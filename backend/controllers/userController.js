import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Helper helper function to sign JSON Web Tokens
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new storefront user profile
// @route   POST /api/users/signup
export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // 1. Check if user already exists in MongoDB
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email account already registered" });
    }

    // 2. Encrypt the plain text password using bcrypt hash cycles
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Initialize a clean base cart data structure map (tracking 300 item slots)
    let emptyCart = {};
    for (let i = 0; i < 300; i++) {
      emptyCart[i] = 0;
    }

    // 4. Save the user document into MongoDB Atlas
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      cartData: emptyCart
    });

    const user = await newUser.save();
    
    // 5. Generate secure authorization token string
    const token = createToken(user._id);

    console.log(`👤 User Registered Successfully: ${user.email}`);
    res.json({ success: true, token, message: "Account created successfully!" });
  } catch (error) {
    console.error("❌ Signup Error Context:", error);
    res.status(500).json({ success: false, message: "Signup execution pipeline failure" });
  }
};

// @desc    Authenticate shopper credentials
// @route   POST /api/users/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Search if email index references exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email account references" });
    }

    // 2. Compare user raw text input string with encrypted secure database hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password configuration entry" });
    }

    // 3. Issue user token string if verification is clear
    const token = createToken(user._id);
    
    console.log(`🔒 User Logged In: ${user.email}`);
    res.json({ success: true, token, name: user.name });
  } catch (error) {
    console.error("❌ Login Error Context:", error);
    res.status(500).json({ success: false, message: "Login execution pipeline failure" });
  }
};

// @desc    Sync and save items to user database cart
// @route   POST /api/users/addtocart
export const addToCart = async (req, res) => {
  try {
    let userData = await User.findById(req.user.id);
    let cartData = userData.cartData || {};
    
    // Increment product ID quantity tally
    cartData[req.body.itemId] = (cartData[req.body.itemId] || 0) + 1;
    
    await User.findByIdAndUpdate(req.user.id, { cartData });
    res.json({ success: true, message: "Item added to cloud cart database successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cart update transaction failed" });
  }
};

// @desc    Decrement items from user database cart
// @route   POST /api/users/removefromcart
export const removeFromCart = async (req, res) => {
  try {
    let userData = await User.findById(req.user.id);
    let cartData = userData.cartData || {};
    
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    
    await User.findByIdAndUpdate(req.user.id, { cartData });
    res.json({ success: true, message: "Item decremented from cloud cart database successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cart reduction transaction failed" });
  }
};

// @desc    Retrieve saved cart database array structure on user login
// @route   GET /api/users/getcart
export const getCart = async (req, res) => {
  try {
    let userData = await User.findById(req.user.id);
    res.json(userData.cartData);
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to retrieve cart data records" });
  }
};