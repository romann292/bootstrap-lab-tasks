/**
 * ============================================================================
 * StoryController
 * ============================================================================
 * Controls the Story Modal dialog, progress bar interval timer, and escape keys.
 *
 * Part of: Facebook Clone (Lab 2 Task 2)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class StoryController {
  constructor(storyServiceInstance) {
    this.service = storyServiceInstance || (typeof window !== 'undefined' ? window.storyService : null);
    this._storyTimer = null;
    this._initKeyboard();
  }

  _initKeyboard() {
    if (typeof document === 'undefined') return;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeStoryModal();
      }
    });
  }

  openStoryModal(author, img, avatarClass, caption) {
    if (typeof document === 'undefined') return;
    const modal = document.getElementById('storyModal');
    const modalImg = document.getElementById('modalStoryImg');
    const modalAuthor = document.getElementById('modalStoryAuthor');
    const modalCaption = document.getElementById('modalStoryCaption');
    const progressFill = document.getElementById('storyProgressFill');
    const modalAvatar = document.getElementById('modalStoryAvatar');

    if (!modal) return;

    if (modalImg) modalImg.src = img;
    if (modalAuthor) modalAuthor.textContent = author;
    if (modalCaption) modalCaption.textContent = caption;

    if (modalAvatar) {
      modalAvatar.textContent = author.charAt(0);
      const computedClass = this.service ? this.service.getAvatarClass(author) : 'insha-avatar';
      modalAvatar.className = 'contact-avatar ' + computedClass;
    }

    modal.style.display = 'flex';

    if (progressFill) progressFill.style.width = '0%';
    let progress = 0;
    clearInterval(this._storyTimer);

    this._storyTimer = setInterval(() => {
      progress += 2;
      if (progressFill) progressFill.style.width = progress + '%';
      if (progress >= 100) {
        clearInterval(this._storyTimer);
        this.closeStoryModal();
      }
    }, 100);
  }

  closeStoryModal() {
    if (typeof document === 'undefined') return;
    const modal = document.getElementById('storyModal');
    if (modal) {
      modal.style.display = 'none';
    }
    clearInterval(this._storyTimer);
  }
}

const storyController = new StoryController(typeof storyService !== 'undefined' ? storyService : null);

if (typeof window !== 'undefined') {
  window.StoryController = StoryController;
  window.storyController = storyController;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StoryController, storyController };
}
