/**
 * ============================================================================
 * FacebookModule (Master Module for Facebook Feed Clone)
 * ============================================================================
 * Coordinates Feed, Story, and Chat modules, services, and controllers.
 * Wires global browser window functions for inline onclick handlers.
 *
 * Part of: Facebook Clone (Lab 2 Task 2)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class FacebookModule {
  constructor() {
    this.services = {
      feed: typeof feedService !== 'undefined' ? feedService : null,
      story: typeof storyService !== 'undefined' ? storyService : null,
      chat: typeof chatService !== 'undefined' ? chatService : null
    };

    this.controllers = {
      feed: typeof feedController !== 'undefined' ? feedController : null,
      story: typeof storyController !== 'undefined' ? storyController : null,
      chat: typeof chatController !== 'undefined' ? chatController : null
    };

    this.bindGlobals();
  }

  bindGlobals() {
    if (typeof window === 'undefined') return;

    // Feed Controller Bindings
    window.toggleLike = (btn) => this.controllers.feed?.toggleLike(btn);
    window.focusCommentInput = (id) => this.controllers.feed?.focusCommentInput(id);
    window.handleCommentSubmit = (e, el, pid) => this.controllers.feed?.handleCommentSubmit(e, el, pid);
    window.escapeHtml = (t) => this.services.feed?.escapeHtml(t) || t;

    // Story Controller Bindings
    window.openStoryModal = (author, img, avatarClass, caption) =>
      this.controllers.story?.openStoryModal(author, img, avatarClass, caption);
    window.closeStoryModal = () => this.controllers.story?.closeStoryModal();

    // Chat Controller Bindings
    window.openChat = (friendName, avatarClass) => this.controllers.chat?.openChat(friendName, avatarClass);
    window.closeChat = () => this.controllers.chat?.closeChat();
    window.handleChatSend = (e) => this.controllers.chat?.handleChatSend(e);
    window.sendChatMessage = () => this.controllers.chat?.sendChatMessage();

    console.log('%c[FacebookModule] Controllers, Services, and Modules initialized for Facebook Task 2.', 'color:#0866ff;font-weight:bold;');
  }
}

const facebookModule = new FacebookModule();

if (typeof window !== 'undefined') {
  window.FacebookModule = FacebookModule;
  window.facebookModule = facebookModule;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FacebookModule, facebookModule };
}
