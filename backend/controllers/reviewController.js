import Review from "../models/Review.js";

// @desc    Post a new product review
// @route   POST /api/reviews/add
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;
    const userName = req.user.name; // Injected by your protectUser auth middleware

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Please provide a rating and written feedback." });
    }

    // Optional Guard: Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({ productId, userId });
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: "You have already left a review for this product." });
    }

    const review = new Review({
      productId,
      userId,
      userName,
      rating: Number(rating),
      comment
    });

    await review.save();
    res.status(201).json({ success: true, message: "Review posted successfully!", review });
  } catch (error) {
    console.error("Error adding product review:", error);
    res.status(500).json({ success: false, message: "Server error saving review parameters." });
  }
};

// @desc    Fetch reviews for a single product and compute average star rating
// @route   GET /api/reviews/product/:productId
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).sort({ date: -1 });

    // Calculate dynamic stats
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? (reviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews).toFixed(1)
      : 0;

    res.json({
      success: true,
      averageRating: Number(averageRating),
      totalReviews,
      reviews
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ success: false, message: "Failed to read database review records." });
  }
};

// @desc    Get all reviews in database (for moderation)
// @route   GET /api/reviews/admin/all
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ date: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a review as system admin
// @route   DELETE /api/reviews/admin/delete/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    await review.deleteOne();
    res.json({ success: true, message: "Review deleted successfully from database." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete review record." });
  }
};