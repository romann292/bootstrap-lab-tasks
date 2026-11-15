/**
 * ============================================================================
 * UIModule
 * ============================================================================
 * Feature module encapsulating UI theme, toasts, and visual presentation logic.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class UIModule {
  constructor(uiControllerInstance) {
    this.controller = uiControllerInstance || (typeof window !== 'undefined' ? window.uiController : null);
  }

  init() {
    if (this.controller) {
      this.controller.init();
    }
  }

  toggleTheme() {
    this.controller?.toggleTheme();
  }

  showToast(message, type) {
    this.controller?.showToast(message, type);
  }
}

const uiModule = new UIModule(typeof uiController !== 'undefined' ? uiController : null);

if (typeof window !== 'undefined') {
  window.UIModule = UIModule;
  window.uiModule = uiModule;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UIModule, uiModule };
}
