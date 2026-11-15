/**
 * ============================================================================
 * AuthModule
 * ============================================================================
 * Feature module encapsulating user authentication, login/signup workflows,
 * user sessions, and profile UI management.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class AuthModule {
  constructor(authServiceInstance, authControllerInstance) {
    this.service = authServiceInstance || (typeof window !== 'undefined' ? window.authService : null);
    this.controller = authControllerInstance || (typeof window !== 'undefined' ? window.authController : null);
  }

  init() {
    this.controller?.init();
  }

  getCurrentUser() {
    return this.service?.getCurrentUser();
  }

  login(email, password) {
    return this.service?.login(email, password);
  }

  signup(data) {
    return this.service?.signup(data);
  }

  logout() {
    return this.service?.logout();
  }
}

const authModule = new AuthModule(
  typeof authService !== 'undefined' ? authService : null,
  typeof authController !== 'undefined' ? authController : null
);

if (typeof window !== 'undefined') {
  window.AuthModule = AuthModule;
  window.authModule = authModule;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthModule, authModule };
}
