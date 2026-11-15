/**
 * ============================================================================
 * StoryService
 * ============================================================================
 * Business logic for stories metadata, avatar mappings, and timing constants.
 *
 * Part of: Facebook Clone (Lab 2 Task 2)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class StoryService {
  constructor() {
    this._friends = [
      { name: "Insha Rehman", avatarClass: "insha-avatar" },
      { name: "Aniqa Noor", avatarClass: "aniqa-avatar" },
      { name: "Sana Malik", avatarClass: "sana-avatar" },
      { name: "Wania Tariq", avatarClass: "wania-avatar" }
    ];
  }

  getAvatarClass(author) {
    if (author.includes('Insha')) return 'insha-avatar';
    if (author.includes('Aniqa')) return 'aniqa-avatar';
    if (author.includes('Sana')) return 'sana-avatar';
    return 'wania-avatar';
  }
}

const storyService = new StoryService();

if (typeof window !== 'undefined') {
  window.StoryService = StoryService;
  window.storyService = storyService;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StoryService, storyService };
}
