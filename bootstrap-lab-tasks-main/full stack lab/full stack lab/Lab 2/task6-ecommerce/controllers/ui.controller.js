/**
 * ============================================================================
 * UIController
 * ============================================================================
 * Manages presentation layer events, themes (Dark/Light mode), dynamic toast
 * alerts, star rating HTML generation, and view state transitions.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class UIController {
  constructor(storageServiceInstance) {
    this._storage = storageServiceInstance || (typeof window !== 'undefined' && window.storageService ? window.storageService : null);
    this._themeKey = 'electro_theme';
    this._currentTheme = 'light';
  }

  init() {
    if (this._storage) {
      this._currentTheme = this._storage.getItem(this._themeKey, 'light');
    }
    this.applyTheme(this._currentTheme);
  }

  getCurrentTheme() {
    return this._currentTheme;
  }

  /**
   * Applies the theme to the root HTML document and updates icon indicators.
   * @param {string} theme - 'dark' or 'light'
   */
  applyTheme(theme) {
    this._currentTheme = theme;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-bs-theme', theme);
      const themeIcon = document.getElementById('themeIcon');
      if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars-fill text-dark';
      }
    }
    if (this._storage) {
      this._storage.setItem(this._themeKey, theme);
    }
  }

  /**
   * Toggles between dark and light themes with user notification.
   */
  toggleTheme() {
    const nextTheme = this._currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
    this.showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  }

  /**
   * Displays an animated Bootstrap 5 toast notification in the viewport.
   * @param {string} message - Notification text
   * @param {string} type - 'success', 'danger', 'warning', 'info'
   */
  showToast(message, type = 'info') {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
      success: 'bi-check-circle-fill text-success',
      danger: 'bi-x-circle-fill text-danger',
      warning: 'bi-exclamation-triangle-fill text-warning',
      info: 'bi-info-circle-fill text-primary'
    };

    const toastId = 'toast-' + Date.now();
    const toastEl = document.createElement('div');
    toastEl.className = 'toast custom-toast align-items-center border-0 mb-2';
    toastEl.id = toastId;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2 py-3 px-3">
          <i class="bi ${icons[type] || icons.info} fs-5"></i>
          <div class="small fw-semibold text-main">${message}</div>
        </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    container.appendChild(toastEl);
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
      const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
      toast.show();
      toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    } else {
      setTimeout(() => toastEl.remove(), 3500);
    }
  }

  /**
   * Generates Bootstrap icon HTML for fractional star ratings.
   * @param {number} rating
   * @returns {string}
   */
  getStarHTML(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.4;
    let html = '';
    for (let i = 0; i < fullStars; i++) html += '<i class="bi bi-star-fill text-warning"></i>';
    if (hasHalf) html += '<i class="bi bi-star-half text-warning"></i>';
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) html += '<i class="bi bi-star text-muted"></i>';
    return html;
  }
}

// Universal export
const uiController = new UIController(typeof storageService !== 'undefined' ? storageService : null);

if (typeof window !== 'undefined') {
  window.UIController = UIController;
  window.uiController = uiController;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UIController, uiController };
}
