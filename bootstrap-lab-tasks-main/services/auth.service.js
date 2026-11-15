/**
 * ============================================================================
 * AuthService
 * ============================================================================
 * Handles user authentication business logic, session persistence via
 * StorageService, input validation, and user profile management.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class AuthService {
  constructor(storageServiceInstance) {
    this._storage = storageServiceInstance || (typeof window !== 'undefined' && window.storageService ? window.storageService : null);
    this._storageKey = 'electro_user';
    this._currentUser = null;
    this._loadInitialSession();
  }

  _loadInitialSession() {
    if (this._storage) {
      this._currentUser = this._storage.getItem(this._storageKey, null);
    }
    // Provide default demo student session if none exists
    if (!this._currentUser) {
      this._currentUser = {
        name: "Roman Fatima",
        email: "roman.fatima@students.au.edu.pk",
        regNo: "241878",
        avatar: "RF",
        phone: "+92 300 1234567"
      };
      if (this._storage) {
        this._storage.setItem(this._storageKey, this._currentUser);
      }
    }
  }

  /**
   * Returns currently active user session.
   * @returns {Object|null}
   */
  getCurrentUser() {
    return this._currentUser;
  }

  /**
   * Checks if user is authenticated.
   * @returns {boolean}
   */
  isAuthenticated() {
    return this._currentUser !== null;
  }

  /**
   * Validates email format.
   * @param {string} email
   * @returns {boolean}
   */
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * Validates password strength (min 6 characters).
   * @param {string} password
   * @returns {boolean}
   */
  validatePassword(password) {
    return typeof password === 'string' && password.trim().length >= 6;
  }

  /**
   * Authenticates user with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {{ success: boolean, message: string, user?: Object }}
   */
  login(email, password) {
    if (!email || !password) {
      return { success: false, message: "Please provide both email and password." };
    }
    if (!this.validateEmail(email)) {
      return { success: false, message: "Please enter a valid email address." };
    }

    const cleanEmail = email.trim();
    const derivedName = cleanEmail.split('@')[0]
      .replace(/[\._]/g, ' ')
      .replace(/(^\w|\s\w)/g, m => m.toUpperCase());

    const initials = derivedName.split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const user = {
      name: derivedName || "Student User",
      email: cleanEmail,
      avatar: initials || "ST",
      regNo: "241878",
      phone: "+92 300 1234567"
    };

    this._currentUser = user;
    if (this._storage) {
      this._storage.setItem(this._storageKey, user);
    }

    return { success: true, message: `Welcome back, ${user.name}!`, user };
  }

  /**
   * Registers a new user account with field validation.
   * @param {Object} data
   * @returns {{ success: boolean, message: string, user?: Object }}
   */
  signup({ name, email, password, confirmPassword, phone } = {}) {
    if (!name || !name.trim()) {
      return { success: false, message: "Please enter your full name." };
    }
    if (!email || !this.validateEmail(email)) {
      return { success: false, message: "Please provide a valid email address." };
    }
    if (!password || password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }
    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match! Please verify." };
    }

    const initials = name.trim().split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const user = {
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      avatar: initials || "ST",
      regNo: "241878"
    };

    this._currentUser = user;
    if (this._storage) {
      this._storage.setItem(this._storageKey, user);
    }

    return { success: true, message: `Account created successfully! Welcome, ${user.name} 🎉`, user };
  }

  /**
   * Logs out the current user and clears session storage.
   */
  logout() {
    this._currentUser = null;
    if (this._storage) {
      this._storage.removeItem(this._storageKey);
    }
    return { success: true, message: "You have been signed out." };
  }

  /**
   * Returns pre-configured demo student credentials.
   */
  getDemoCredentials() {
    return {
      email: "roman.fatima@students.au.edu.pk",
      password: "student2026"
    };
  }
}

// Universal export
const authService = new AuthService(typeof storageService !== 'undefined' ? storageService : null);

if (typeof window !== 'undefined') {
  window.AuthService = AuthService;
  window.authService = authService;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthService, authService };
}
