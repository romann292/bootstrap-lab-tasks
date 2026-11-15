/**
 * ============================================================================
 * ReviewController
 * ============================================================================
 * Controls review card rendering, interactive star rating selection
 * (hover / click), and verified review form submissions.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class ReviewController {
  constructor(reviewServiceInstance, authServiceInstance, uiControllerInstance) {
    this._reviewService = reviewServiceInstance || (typeof window !== 'undefined' && window.reviewService ? window.reviewService : null);
    this._authService = authServiceInstance || (typeof window !== 'undefined' && window.authService ? window.authService : null);
    this._uiController = uiControllerInstance || (typeof window !== 'undefined' && window.uiController ? window.uiController : null);

    this._selectedRating = 5;
  }

  init() {
    this.renderReviews();
    this._bindStarPicker();
  }

  _bindStarPicker() {
    if (typeof document === 'undefined') return;
    const starIcons = document.querySelectorAll('#starPicker i');
    const self = this;

    starIcons.forEach(icon => {
      icon.addEventListener('mouseover', function() {
        const val = parseInt(this.dataset.value, 10);
        starIcons.forEach((s, idx) => {
          s.classList.toggle('hover', idx < val);
        });
      });
      icon.addEventListener('mouseout', function() {
        starIcons.forEach(s => s.classList.remove('hover'));
      });
      icon.addEventListener('click', function() {
        self.setRatingStar(parseInt(this.dataset.value, 10));
      });
    });
  }

  /**
   * Sets interactive star rating value.
   */
  setRatingStar(val) {
    this._selectedRating = val;
    if (typeof document === 'undefined') return;
    const stars = document.querySelectorAll('#starPicker i');
    stars.forEach((s, idx) => {
      s.className = idx < val ? 'bi bi-star-fill active' : 'bi bi-star';
    });
  }

  /**
   * Renders review testimonial cards in the DOM.
   */
  renderReviews() {
    if (typeof document === 'undefined' || !this._reviewService) return;
    const container = document.getElementById('reviewsContainer');
    if (!container) return;

    const reviews = this._reviewService.getAllReviews();

    container.innerHTML = reviews.map(rev => {
      const starHtml = this._uiController ? this._uiController.getStarHTML(rev.rating) : '★★★★★';
      const initials = rev.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

      return `
        <div class="col-md-6 col-lg-3">
          <div class="review-card">
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="reviewer-avatar" style="background:${rev.avatarColor || '#4f46e5'}">
                ${initials}
              </div>
              <div>
                <h6 class="fw-bold mb-0">${rev.name}</h6>
                <div class="text-muted small">${rev.date}</div>
              </div>
            </div>
            <div class="d-flex align-items-center gap-2 mb-2">
              <div class="text-warning">${starHtml}</div>
              ${rev.verified ? '<span class="badge bg-success-subtle text-success small border border-success-subtle"><i class="bi bi-shield-check me-1"></i>Verified</span>' : ''}
            </div>
            <h6 class="fw-bold text-dark dark-text-light mb-1">${rev.title}</h6>
            <p class="text-muted small flex-grow-1">${rev.comment}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Handles review form submit.
   */
  handleReviewSubmit(e) {
    if (e) e.preventDefault();
    if (typeof document === 'undefined' || !this._reviewService) return;

    const user = this._authService ? this._authService.getCurrentUser() : null;
    const nameInput = document.getElementById('reviewAuthorName');
    const name = (nameInput && nameInput.value.trim()) || (user ? user.name : "Roman Fatima");
    const title = document.getElementById('reviewTitleInput')?.value || '';
    const comment = document.getElementById('reviewCommentInput')?.value || '';

    const res = this._reviewService.addReview({
      name,
      rating: this._selectedRating,
      title,
      comment
    });

    if (!res.success) {
      this._uiController?.showToast(res.message, "warning");
      return;
    }

    this.renderReviews();

    const modalEl = document.getElementById('writeReviewModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }

    const form = document.getElementById('reviewForm');
    if (form) form.reset();

    this._uiController?.showToast(res.message, "success");
  }
}

// Universal export
const reviewController = new ReviewController(
  typeof reviewService !== 'undefined' ? reviewService : null,
  typeof authService !== 'undefined' ? authService : null,
  typeof uiController !== 'undefined' ? uiController : null
);

if (typeof window !== 'undefined') {
  window.ReviewController = ReviewController;
  window.reviewController = reviewController;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ReviewController, reviewController };
}
