/**
 * ============================================================================
 * ReviewService
 * ============================================================================
 * Manages customer reviews, star rating calculations, verified buyer badges,
 * and review persistence.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class ReviewService {
  constructor(storageServiceInstance) {
    this._storage = storageServiceInstance || (typeof window !== 'undefined' && window.storageService ? window.storageService : null);
    this._reviewsKey = 'electro_reviews';

    this._initialReviews = [
      {
        id: 1,
        name: "Hamza Tariq",
        rating: 5,
        date: "September 24, 2026",
        title: "Unmatched performance & build quality!",
        comment: "I purchased the MacBook Pro M3 Max for our Full Stack lab projects and deep learning tasks. The compile times are instantaneous and the battery easily lasts 2 full days of lectures. Delivery was within 24 hours.",
        verified: true,
        avatarColor: "#4f46e5"
      },
      {
        id: 2,
        name: "Ayesha Malik",
        rating: 5,
        date: "September 20, 2026",
        title: "Best ANC headphones on the market",
        comment: "The Sony WH-1000XM5 blocks out university cafeteria noise completely. The microphone quality on Zoom and Teams presentations is exceptionally clear. Super comfortable for 6+ hours of continuous study.",
        verified: true,
        avatarColor: "#06b6d4"
      },
      {
        id: 3,
        name: "Dr. Farooq Khan",
        rating: 5,
        date: "September 15, 2026",
        title: "Exceptional shopping experience & student discount",
        comment: "Used the AU2026 promo coupon and received a 15% discount. The checkout process was seamless with multiple payment options and immediate digital invoice generation. Highly recommended for students and faculty.",
        verified: true,
        avatarColor: "#10b981"
      },
      {
        id: 4,
        name: "Zainab Raza",
        rating: 4,
        date: "September 10, 2026",
        title: "Keychron mechanical keyboard is pure typing bliss",
        comment: "The tactile feedback and wireless multi-device switching between my laptop and iPad make this the best keyboard I have ever owned. Arrived in pristine condition.",
        verified: true,
        avatarColor: "#f59e0b"
      }
    ];

    this._reviews = [];
    this._loadReviews();
  }

  _loadReviews() {
    if (this._storage) {
      this._reviews = this._storage.getItem(this._reviewsKey, this._initialReviews);
    } else {
      this._reviews = [...this._initialReviews];
    }
  }

  _saveReviews() {
    if (this._storage) {
      this._storage.setItem(this._reviewsKey, this._reviews);
    }
  }

  /**
   * Retrieves all verified reviews.
   */
  getAllReviews() {
    return [...this._reviews];
  }

  /**
   * Adds a new customer review.
   * @param {Object} reviewData
   */
  addReview({ name, rating, title, comment } = {}) {
    if (!title || !title.trim()) {
      return { success: false, message: "Review headline / title is required." };
    }
    if (!comment || !comment.trim()) {
      return { success: false, message: "Review feedback comment is required." };
    }

    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const newEntry = {
      id: Date.now(),
      name: (name && name.trim()) || "Roman Fatima",
      rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      title: title.trim(),
      comment: comment.trim(),
      verified: true,
      avatarColor: randomColor
    };

    this._reviews.unshift(newEntry);
    this._saveReviews();

    return {
      success: true,
      review: newEntry,
      message: "Thank you! Your verified review has been published ⭐"
    };
  }

  /**
   * Computes the average overall rating across all reviews.
   */
  getAverageRating() {
    if (this._reviews.length === 0) return 0;
    const total = this._reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / this._reviews.length).toFixed(1);
  }
}

// Universal export
const reviewService = new ReviewService(typeof storageService !== 'undefined' ? storageService : null);

if (typeof window !== 'undefined') {
  window.ReviewService = ReviewService;
  window.reviewService = reviewService;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ReviewService, reviewService };
}
