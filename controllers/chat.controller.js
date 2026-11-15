/**
 * ============================================================================
 * ChatController
 * ============================================================================
 * Controls the Messenger mini-chat dock, message dispatching, and reply simulation.
 *
 * Part of: Facebook Clone (Lab 2 Task 2)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class ChatController {
  constructor(chatServiceInstance) {
    this.service = chatServiceInstance || (typeof window !== 'undefined' ? window.chatService : null);
  }

  openChat(friendName, avatarClass) {
    if (typeof document === 'undefined') return;
    const chatDock = document.getElementById('chatDock');
    const targetName = document.getElementById('chatTargetName');
    const messagesBox = document.getElementById('chatMessages');

    if (!chatDock) return;

    if (targetName) targetName.textContent = friendName;
    chatDock.style.display = 'flex';

    const greeting = this.service ? this.service.getInitialGreeting(friendName) : "Hey Roman!! ✨";

    if (messagesBox) {
      messagesBox.innerHTML = `
        <div class="chat-bubble received">${greeting}</div>
      `;
    }
  }

  closeChat() {
    if (typeof document === 'undefined') return;
    const chatDock = document.getElementById('chatDock');
    if (chatDock) {
      chatDock.style.display = 'none';
    }
  }

  handleChatSend(event) {
    if (event.key === 'Enter') {
      this.sendChatMessage();
    }
  }

  sendChatMessage() {
    if (typeof document === 'undefined') return;
    const input = document.getElementById('chatInput');
    const messagesBox = document.getElementById('chatMessages');
    if (!input || !messagesBox || input.value.trim() === '') return;

    const msgText = input.value.trim();
    const sentBubble = document.createElement('div');
    sentBubble.className = 'chat-bubble sent';
    sentBubble.textContent = msgText;
    messagesBox.appendChild(sentBubble);

    input.value = '';
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // Simulated response from friend after 1s
    setTimeout(() => {
      const friendName = document.getElementById('chatTargetName')?.textContent || 'Friend';
      const replyMsg = this.service ? this.service.getAutoReply(friendName) : '💖🌸';
      const replyBubble = document.createElement('div');
      replyBubble.className = 'chat-bubble received';
      replyBubble.textContent = replyMsg;
      messagesBox.appendChild(replyBubble);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }, 1000);
  }
}

const chatController = new ChatController(typeof chatService !== 'undefined' ? chatService : null);

if (typeof window !== 'undefined') {
  window.ChatController = ChatController;
  window.chatController = chatController;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ChatController, chatController };
}
