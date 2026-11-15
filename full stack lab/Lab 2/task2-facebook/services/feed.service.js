/**
 * ============================================================================
 * FeedService
 * ============================================================================
 * Business logic for post likes, comment storage, and HTML sanitization.
 *
 * Part of: Facebook Clone (Lab 2 Task 2)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class FeedService {
  constructor() {
    this._likedPosts = new Set();
  }

  toggleLike(postId) {
    if (this._likedPosts.has(postId)) {
      this._likedPosts.delete(postId);
      return { liked: false };
    } else {
      this._likedPosts.add(postId);
      return { liked: true };
    }
  }

  isLiked(postId) {
    return this._likedPosts.has(postId);
  }

  escapeHtml(text) {
    if (typeof document === 'undefined') return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

const feedService = new FeedService();

if (typeof window !== 'undefined') {
  window.FeedService = FeedService;
  window.feedService = feedService;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FeedService, feedService };
}
