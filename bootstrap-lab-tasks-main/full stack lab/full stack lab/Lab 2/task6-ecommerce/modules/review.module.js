/**
 * ============================================================================
 * ReviewModule
 * ============================================================================
 * Feature module encapsulating customer reviews, ratings calculations,
 * interactive star picker, and review testimonial publishing.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class ReviewModule {
  constructor(reviewServiceInstance, reviewControllerInstance) {
    this.service = reviewServiceInstance || (typeof window !== 'undefined' ? window.reviewService : null);
    this.controller = reviewControllerInstance || (typeof window !== 'undefined' ? window.reviewController : null);
  }

  init() {
    this.controller?.init();
  }

  getAllReviews() {
    return this.service?.getAllReviews();
  }

  getAverageRating() {
    return this.service?.getAverageRating();
  }
}

const reviewModule = new ReviewModule(
  typeof reviewService !== 'undefined' ? reviewService : null,
  typeof reviewController !== 'undefined' ? reviewController : null
);

if (typeof window !== 'undefined') {
  window.ReviewModule = ReviewModule;
  window.reviewModule = reviewModule;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ReviewModule, reviewModule };
}
