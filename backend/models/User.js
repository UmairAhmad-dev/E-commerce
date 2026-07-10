import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cartData: {
    type: Object,
  },
  role: {
    type: String,
    enum: ["customer", "admin"], // Only allows these two role definitions
    default: "customer",
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const User = mongoose.model("User", userSchema);
export default User;