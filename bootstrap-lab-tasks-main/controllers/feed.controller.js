/**
 * ============================================================================
 * FeedController
 * ============================================================================
 * Handles Feed DOM events: Like button toggles, comment input focusing,
 * and comment creation.
 *
 * Part of: Facebook Clone (Lab 2 Task 2)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class FeedController {
  constructor(feedServiceInstance) {
    this.service = feedServiceInstance || (typeof window !== 'undefined' ? window.feedService : null);
  }

  toggleLike(btn) {
    if (!btn) return;
    btn.classList.toggle('liked');
    const span = btn.querySelector('span');
    const isLiked = btn.classList.contains('liked');

    if (isLiked) {
      if (span) span.textContent = 'Liked';
      btn.style.color = '#0866ff';
    } else {
      if (span) span.textContent = 'Like';
      btn.style.color = '';
    }
  }

  focusCommentInput(inputId) {
    if (typeof document === 'undefined') return;
    const input = document.getElementById(inputId);
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  handleCommentSubmit(event, inputElement, postId) {
    if (event.key === 'Enter' && inputElement.value.trim() !== '') {
      event.preventDefault();
      const commentText = inputElement.value.trim();
      const postCard = document.getElementById(postId);
      if (!postCard) return;

      const commentsContainer = postCard.querySelector('.post-comments-container');
      const writeRow = postCard.querySelector('.write-comment-row');

      const safeText = this.service ? this.service.escapeHtml(commentText) : commentText;

      const newComment = document.createElement('div');
      newComment.className = 'comment-item';
      newComment.innerHTML = `
        <img src="img2.jpg" class="comment-avatar" alt="Roman Fatima">
        <div class="comment-bubble">
          <div class="comment-author-name">Roman Fatima</div>
          <div class="comment-body-text">${safeText}</div>
        </div>
      `;

      if (commentsContainer && writeRow) {
        commentsContainer.insertBefore(newComment, writeRow);
      }

      inputElement.value = '';

      const statsBar = postCard.querySelector('.comments-shares-summary span');
      if (statsBar) {
        const match = statsBar.textContent.match(/\d+/);
        if (match) {
          const count = parseInt(match[0], 10) + 1;
          statsBar.textContent = `${count} comments`;
        }
      }
    }
  }
}

const feedController = new FeedController(typeof feedService !== 'undefined' ? feedService : null);

if (typeof window !== 'undefined') {
  window.FeedController = FeedController;
  window.feedController = feedController;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FeedController, feedController };
}
