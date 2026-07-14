import React, { useState, useEffect } from 'react';
import './ProductReviews.css';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/reviews/product/${productId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        setAvgRating(data.averageRating || 0);
        setTotal(data.totalReviews || 0);
      }
    } catch (error) {
      console.error("Error fetching product reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFeedback({ text: "", type: "" });
    const token = localStorage.getItem('auth-token');

    if (!token) {
      setFeedback({ text: "⚠️ You must be logged in to leave a review.", type: "error" });
      return;
    }

    if (!comment.trim()) {
      setFeedback({ text: "❌ Please write a review comment.", type: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:4000/api/reviews/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId, rating, comment })
      });
      const data = await res.json();

      if (data.success) {
        setFeedback({ text: "🎉 Thank you! Your review has been posted.", type: "success" });
        setComment("");
        setRating(5);
        fetchReviews(); // Refresh list immediately
      } else {
        setFeedback({ text: `❌ ${data.message}`, type: "error" });
      }
    } catch (error) {
      setFeedback({ text: "❌ Connection error. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-reviews-section">
      <div className="reviews-summary-card">
        <div className="summary-score-block">
          <h3>{avgRating.toFixed(1)}</h3>
          <div className="star-rating">
            {"★".repeat(Math.round(avgRating))}$$\text{ }$$ {"☆".repeat(5 - Math.round(avgRating))}
          </div>
          <p>{total} Verified Reviews</p>
        </div>
        
        <div className="reviews-breakdown-bars">
          <h4>Customer Sentiment</h4>
          <p>Read transparent feedback left by authenticated shoppers who purchased this apparel lookbook.</p>
        </div>
      </div>

      <div className="reviews-dual-layout">
        {/* Write a Review Column */}
        <div className="write-review-form-box">
          <h3>Share Your Experience</h3>
          {feedback.text && (
            <div className={`review-feedback-banner ${feedback.type}`}>
              {feedback.text}
            </div>
          )}
          <form onSubmit={handleSubmitReview}>
            <div className="rating-select-group">
              <label>Your Rating:</label>
              <div className="interactive-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={star <= rating ? "star-active" : "star-inactive"}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="comment-textarea-group">
              <label>Your Review:</label>
              <textarea
                rows="4"
                placeholder="Describe your sizing fit, fabric comfort, and style experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <button type="submit" className="submit-review-btn" disabled={isSubmitting}>
              {isSubmitting ? "POSTING..." : "SUBMIT REVIEW"}
            </button>
          </form>
        </div>

        {/* Existing Reviews Column */}
        <div className="reviews-list-box">
          <h3>User Reviews ({reviews.length})</h3>
          <div className="reviews-scroller">
            {reviews.length === 0 ? (
              <div className="empty-reviews-state">
                <p>No reviews posted yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="individual-review-card">
                  <div className="review-card-header">
                    <strong>{rev.userName}</strong>
                    <span className="review-date-pill">
                      {new Date(rev.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="review-card-stars">
                    {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                  </div>
                  <p className="review-card-body">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;