/**
 * ============================================================================
 * ChatService
 * ============================================================================
 * Business logic for friend conversation greetings, message exchanges, and
 * simulated friend automated replies.
 *
 * Part of: Facebook Clone (Lab 2 Task 2)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class ChatService {
  constructor() {
    this._greetings = {
      'Aniqa': "Hey Roman! Sipping my iced latte ☕ Are all 5 tasks ready to push?",
      'Sana': "Roman! Hope we get full marks on this lab 😴💅",
      'Wania': "Hey Roman! Loved the study session yesterday! 🌸",
      'Default': "Hey Roman!! ✨ How is the Web Dev assignment coming along?"
    };
  }

  getInitialGreeting(friendName) {
    if (friendName.includes('Aniqa')) return this._greetings['Aniqa'];
    if (friendName.includes('Sana')) return this._greetings['Sana'];
    if (friendName.includes('Wania')) return this._greetings['Wania'];
    return this._greetings['Default'];
  }

  getAutoReply(friendName) {
    return `Aww Roman! You're the best! That's going to get an easy A+ from the teacher! 💖🌸`;
  }
}

const chatService = new ChatService();

if (typeof window !== 'undefined') {
  window.ChatService = ChatService;
  window.chatService = chatService;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ChatService, chatService };
}
