import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: Number, // Matches your product ID schema format
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Links the review to a verified customer account
  },
  userName: {
    type: String,
    required: true, // Saved snapshot of the user's name to avoid nested populates
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Restricts reviews strictly to a 5-star matrix scale
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("Review", ReviewSchema);