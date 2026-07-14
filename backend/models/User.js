import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object },
  // 🔑 ROLE-BASED SEGREGATION: SEPARATES CUSTOMERS FROM ADMINISTRATORS
  role: { type: String, default: "user", enum: ["user", "admin"] }, 
  date: { type: Date, default: Date.now },
  
  // 🚀 NEW FIELDS ADDED FOR USER PROFILE DASHBOARD:
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  postalCode: { type: String, default: "" }
});

export default mongoose.model("User", UserSchema);