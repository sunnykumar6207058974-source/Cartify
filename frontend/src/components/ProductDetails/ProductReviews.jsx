import { useState, useEffect, useContext } from "react";
import { CartContext } from "../../context/CartContext";

const INITIAL_REVIEWS_SEED = [
  {
    id: "rev_1",
    name: "Alex Morgan",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    date: "August 12, 2026",
    title: "Incredible Build Quality & Premium Design!",
    comment: "This exceeded all my expectations. The craftsmanship and attention to detail are remarkable. Delivery was lightning fast as well.",
    verified: true,
    helpfulCount: 24,
    recommended: true,
  },
  {
    id: "rev_2",
    name: "Sophia Rodriguez",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    date: "August 04, 2026",
    title: "Best purchase in this category!",
    comment: "Stunning aesthetic, extremely comfortable and durable. Works flawlessly every day. Worth every dollar!",
    verified: true,
    helpfulCount: 18,
    recommended: true,
  },
  {
    id: "rev_3",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
    rating: 4,
    date: "July 26, 2026",
    title: "Great product, solid performance",
    comment: "Very pleased overall. Minor suggestion would be clearer user documentation in the box, but product itself is 5/5.",
    verified: true,
    helpfulCount: 9,
    recommended: true,
  },
];

export default function ProductReviews({ productId, productName }) {
  const { user, addToast } = useContext(CartContext);

  const storageKey = `cartify_reviews_${productId}`;

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS_SEED;
    } catch {
      return INITIAL_REVIEWS_SEED;
    }
  });

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Form State
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formName, setFormName] = useState(user?.name || "");
  const [formTitle, setFormTitle] = useState("");
  const [formComment, setFormComment] = useState("");
  const [formRecommended, setFormRecommended] = useState(true);

  // Helpful votes tracker (IDs of reviews user has voted for)
  const [votedReviews, setVotedReviews] = useState(() => {
    try {
      const saved = localStorage.getItem("cartify_voted_reviews");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem("cartify_voted_reviews", JSON.stringify(votedReviews));
    } catch (e) {
      console.error(e);
    }
  }, [votedReviews]);

  // Calculate Star Breakdown
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "5.0";

  const starCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const filteredReviews = reviews.filter((r) => {
    if (selectedFilter === "all") return true;
    return r.rating === Number(selectedFilter);
  });

  const handleHelpfulVote = (reviewId) => {
    if (votedReviews.includes(reviewId)) {
      addToast("You've already marked this review as helpful!", "info");
      return;
    }
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
      )
    );
    setVotedReviews((prev) => [...prev, reviewId]);
    addToast("Thanks for your feedback! 👍");
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!formComment.trim() || !formTitle.trim()) {
      addToast("Please provide both a headline and review text.", "error");
      return;
    }

    const newReview = {
      id: `rev_${Date.now()}`,
      name: formName.trim() || user?.name || "Verified Customer",
      avatar:
        user?.avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      rating: formRating,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      title: formTitle.trim(),
      comment: formComment.trim(),
      verified: true,
      helpfulCount: 0,
      recommended: formRecommended,
    };

    setReviews([newReview, ...reviews]);
    setShowReviewModal(false);
    setFormTitle("");
    setFormComment("");
    setFormRating(5);
    addToast("Review submitted successfully! Thank you for sharing! ⭐");
  };

  return (
    <div className="product-reviews-section">
      <div className="reviews-section-header">
        <div>
          <h3>Verified Customer Ratings &amp; Reviews</h3>
          <p>Real feedback and ratings from verified buyers</p>
        </div>
        <button
          className="btn-primary write-review-trigger-btn"
          onClick={() => setShowReviewModal(true)}
        >
          ✍️ Write a Review
        </button>
      </div>

      {/* Ratings Overview Summary Matrix */}
      <div className="reviews-overview-card">
        {/* Left: Overall Score */}
        <div className="reviews-overall-score">
          <span className="big-rating-number">{averageRating}</span>
          <div className="stars-large">
            {"★".repeat(Math.round(Number(averageRating)))}
            {"☆".repeat(5 - Math.round(Number(averageRating)))}
          </div>
          <span className="total-reviews-caption">
            Based on <strong>{totalReviews}</strong> customer review{totalReviews !== 1 ? "s" : ""}
          </span>
          <span className="recommend-badge">
            ✓ 98% of customers recommend this item
          </span>
        </div>

        {/* Middle: Star breakdown progress bars */}
        <div className="rating-bars-container">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = starCounts[stars] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div
                key={stars}
                className={`rating-bar-row ${selectedFilter === String(stars) ? "filter-active" : ""}`}
                onClick={() =>
                  setSelectedFilter(selectedFilter === String(stars) ? "all" : String(stars))
                }
                title={`Filter by ${stars} star reviews`}
              >
                <span className="bar-star-label">{stars} ★</span>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <span className="bar-count-label">
                  {pct}% ({count})
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Quick Highlights */}
        <div className="reviews-perks-summary">
          <div className="perk-item">
            <span className="perk-icon">🛡️</span>
            <div>
              <strong>100% Authentic</strong>
              <span>Verified verified buyer reviews only</span>
            </div>
          </div>
          <div className="perk-item">
            <span className="perk-icon">⚡</span>
            <div>
              <strong>Instant Publishing</strong>
              <span>Reviews update store metrics instantly</span>
            </div>
          </div>
          <div className="perk-item">
            <span className="perk-icon">💎</span>
            <div>
              <strong>Quality Guarantee</strong>
              <span>30-Day Money Back policy applies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="reviews-filters-bar">
        <span className="filter-title">Filter by:</span>
        <button
          className={`filter-chip ${selectedFilter === "all" ? "active" : ""}`}
          onClick={() => setSelectedFilter("all")}
        >
          All Reviews ({totalReviews})
        </button>
        {[5, 4, 3, 2, 1].map((s) => (
          <button
            key={s}
            className={`filter-chip ${selectedFilter === String(s) ? "active" : ""}`}
            onClick={() => setSelectedFilter(String(s))}
          >
            {s} Stars ({starCounts[s] || 0})
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="reviews-feed-list">
        {filteredReviews.length === 0 ? (
          <div className="no-reviews-box">
            <p>No reviews found for the selected {selectedFilter}-star filter.</p>
            <button className="btn-secondary btn-sm" onClick={() => setSelectedFilter("all")}>
              Reset Filters
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div key={rev.id} className="review-card-item animate-fade-in">
              <div className="review-card-top">
                <div className="reviewer-info">
                  <img src={rev.avatar} alt={rev.name} className="reviewer-avatar" />
                  <div>
                    <div className="reviewer-name-row">
                      <span className="reviewer-name">{rev.name}</span>
                      {rev.verified && (
                        <span className="verified-buyer-badge">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="review-date">{rev.date}</span>
                  </div>
                </div>

                <div className="review-stars-badge">
                  {"★".repeat(rev.rating)}
                  {"☆".repeat(5 - rev.rating)}
                </div>
              </div>

              <h4 className="review-headline">{rev.title}</h4>
              <p className="review-body-text">{rev.comment}</p>

              <div className="review-footer-row">
                {rev.recommended && (
                  <span className="review-recommended-tag">
                    👍 Recommends this product
                  </span>
                )}

                <button
                  className={`helpful-btn ${votedReviews.includes(rev.id) ? "voted" : ""}`}
                  onClick={() => handleHelpfulVote(rev.id)}
                  title="Mark as helpful"
                >
                  Helpful ({rev.helpfulCount || 0}) 👍
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div
            className="modal-content write-review-modal animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowReviewModal(false)}
            >
              ✕
            </button>

            <div className="write-review-header">
              <h3>Write a Review for {productName}</h3>
              <p>Share your honest experience to help fellow shoppers.</p>
            </div>

            <form onSubmit={handleAddReview} className="write-review-form">
              {/* Star rating selector */}
              <div className="form-group">
                <label>Overall Rating</label>
                <div className="interactive-star-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-choice-btn ${
                        (formHoverRating || formRating) >= star ? "star-active" : ""
                      }`}
                      onMouseEnter={() => setFormHoverRating(star)}
                      onMouseLeave={() => setFormHoverRating(0)}
                      onClick={() => setFormRating(star)}
                    >
                      ★
                    </button>
                  ))}
                  <span className="rating-text-label">
                    {formRating === 5
                      ? "5 Stars - Outstanding!"
                      : formRating === 4
                      ? "4 Stars - Great"
                      : formRating === 3
                      ? "3 Stars - Average"
                      : formRating === 2
                      ? "2 Stars - Below Average"
                      : "1 Star - Poor"}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Alex M."
                  required
                />
              </div>

              <div className="form-group">
                <label>Review Headline</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Exceptional sound and sleek design!"
                  required
                />
              </div>

              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  rows="4"
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="What did you like or dislike? How does the quality feel?"
                  required
                ></textarea>
              </div>

              <div className="form-checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formRecommended}
                    onChange={(e) => setFormRecommended(e.target.checked)}
                  />
                  <span>I recommend this product to other shoppers</span>
                </label>
              </div>

              <button type="submit" className="btn-primary submit-review-btn">
                Submit Review ⭐
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
