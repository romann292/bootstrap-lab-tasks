/**
 * ============================================================================
 * AuthController
 * ============================================================================
 * Controls authentication views, handles user login and signup forms,
 * updates navigation profile badges, and manages user session UI state.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class AuthController {
  constructor(authServiceInstance, uiControllerInstance) {
    this._authService = authServiceInstance || (typeof window !== 'undefined' && window.authService ? window.authService : null);
    this._uiController = uiControllerInstance || (typeof window !== 'undefined' && window.uiController ? window.uiController : null);
  }

  init() {
    this.updateAuthUI();
  }

  /**
   * Refreshes the navbar with current user initials, greeting, or login button.
   */
  updateAuthUI() {
    if (typeof document === 'undefined') return;
    const userBtn = document.getElementById('userAuthBtn');
    const userGreeting = document.getElementById('userGreeting');
    if (!userBtn) return;

    const user = this._authService ? this._authService.getCurrentUser() : null;

    if (user) {
      userBtn.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <span class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style="width:32px;height:32px;background:linear-gradient(135deg,#4f46e5,#06b6d4);font-size:0.8rem;">
            ${user.avatar || user.name.slice(0, 2).toUpperCase()}
          </span>
          <span class="d-none d-lg-inline fw-semibold small">${user.name.split(' ')[0]}</span>
        </div>
      `;
      userBtn.setAttribute('data-bs-toggle', 'dropdown');
      userBtn.removeAttribute('onclick');

      if (userGreeting) {
        userGreeting.innerHTML = `Welcome back, <strong>${user.name}</strong>!`;
      }
    } else {
      userBtn.innerHTML = `<i class="bi bi-person-circle fs-5"></i><span class="d-none d-lg-inline fw-semibold small ms-1">Login</span>`;
      userBtn.setAttribute('onclick', 'openLoginModal()');
      userBtn.removeAttribute('data-bs-toggle');
      if (userGreeting) {
        userGreeting.innerHTML = `Welcome, <strong>Guest</strong>`;
      }
    }
  }

  /**
   * Handles user registration form submission.
   */
  handleSignup(event) {
    if (event) event.preventDefault();
    if (typeof document === 'undefined') return;

    const name = document.getElementById('signupName')?.value || '';
    const email = document.getElementById('signupEmail')?.value || '';
    const password = document.getElementById('signupPassword')?.value || '';
    const confirmPassword = document.getElementById('signupConfirmPassword')?.value || '';
    const phone = document.getElementById('signupPhone')?.value || '';

    const result = this._authService.signup({ name, email, password, confirmPassword, phone });

    if (!result.success) {
      this._uiController?.showToast(result.message, "danger");
      return;
    }

    const modalEl = document.getElementById('signupModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }

    this.updateAuthUI();
    this._uiController?.showToast(result.message, "success");
  }

  /**
   * Handles user login form submission.
   */
  handleLogin(event) {
    if (event) event.preventDefault();
    if (typeof document === 'undefined') return;

    const email = document.getElementById('loginEmail')?.value || '';
    const password = document.getElementById('loginPassword')?.value || '';

    const result = this._authService.login(email, password);

    if (!result.success) {
      this._uiController?.showToast(result.message, "warning");
      return;
    }

    const modalEl = document.getElementById('loginModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }

    this.updateAuthUI();
    this._uiController?.showToast(result.message, "success");
  }

  /**
   * Automatically populates and submits pre-configured student credentials.
   */
  demoLogin() {
    if (typeof document === 'undefined') return;
    const creds = this._authService.getDemoCredentials();
    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPassword');

    if (emailInput) emailInput.value = creds.email;
    if (passInput) passInput.value = creds.password;

    this._uiController?.showToast("Demo credentials filled! Logging in...", "info");
    setTimeout(() => {
      const form = document.getElementById('loginForm');
      if (form) form.dispatchEvent(new Event('submit'));
    }, 400);
  }

  /**
   * Signs the user out.
   */
  logoutUser() {
    const res = this._authService.logout();
    this.updateAuthUI();
    this._uiController?.showToast(res.message, "info");
  }

  /**
   * Opens the login modal dialog.
   */
  openLoginModal() {
    if (typeof document === 'undefined') return;
    const modalEl = document.getElementById('loginModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  /**
   * Opens signup modal after closing login modal.
   */
  openSignupModal() {
    if (typeof document === 'undefined') return;
    const loginModalEl = document.getElementById('loginModal');
    if (loginModalEl && typeof bootstrap !== 'undefined') {
      const loginModal = bootstrap.Modal.getInstance(loginModalEl);
      if (loginModal) loginModal.hide();
    }
    const signupModalEl = document.getElementById('signupModal');
    if (signupModalEl && typeof bootstrap !== 'undefined') {
      const signupModal = new bootstrap.Modal(signupModalEl);
      signupModal.show();
    }
  }
}

// Universal export
const authController = new AuthController(
  typeof authService !== 'undefined' ? authService : null,
  typeof uiController !== 'undefined' ? uiController : null
);

if (typeof window !== 'undefined') {
  window.AuthController = AuthController;
  window.authController = authController;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthController, authController };
}
