/**
 * ============================================================================
 * AppModule (Master Root Module)
 * ============================================================================
 * Orchestrates the application bootstrap sequence, wires dependencies across
 * all Services, Controllers, and Modules, and establishes global browser bindings
 * for full backward compatibility with inline HTML event handlers.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class AppModule {
  constructor() {
    this.services = {
      storage: typeof storageService !== 'undefined' ? storageService : null,
      product: typeof productService !== 'undefined' ? productService : null,
      auth: typeof authService !== 'undefined' ? authService : null,
      cart: typeof cartService !== 'undefined' ? cartService : null,
      order: typeof orderService !== 'undefined' ? orderService : null,
      review: typeof reviewService !== 'undefined' ? reviewService : null
    };

    this.controllers = {
      ui: typeof uiController !== 'undefined' ? uiController : null,
      auth: typeof authController !== 'undefined' ? authController : null,
      product: typeof productController !== 'undefined' ? productController : null,
      cart: typeof cartController !== 'undefined' ? cartController : null,
      checkout: typeof checkoutController !== 'undefined' ? checkoutController : null,
      review: typeof reviewController !== 'undefined' ? reviewController : null
    };

    this.modules = {
      ui: typeof uiModule !== 'undefined' ? uiModule : null,
      auth: typeof authModule !== 'undefined' ? authModule : null,
      product: typeof productModule !== 'undefined' ? productModule : null,
      cart: typeof cartModule !== 'undefined' ? cartModule : null,
      checkout: typeof checkoutModule !== 'undefined' ? checkoutModule : null,
      review: typeof reviewModule !== 'undefined' ? reviewModule : null
    };

    this._initialized = false;
  }

  /**
   * Initializes all sub-modules in sequence.
   */
  bootstrap() {
    if (this._initialized) return;

    // 1. Initialize UI presentation layer
    this.modules.ui?.init();

    // 2. Initialize Authentication & Session
    this.modules.auth?.init();

    // 3. Initialize Product Catalog
    this.modules.product?.init();

    // 4. Initialize Shopping Cart
    this.modules.cart?.init();

    // 5. Initialize Reviews & Testimonials
    this.modules.review?.init();

    // 6. Initialize Checkout
    this.modules.checkout?.init();

    // 7. Expose backward-compatible global functions
    this.bindGlobals();

    this._initialized = true;
    console.log('%c[AppModule] NovaStore E-Commerce initialized with Modular MVC Architecture (Controllers, Services, Modules)', 'color: #0d6efd; font-weight: bold;');
  }

  /**
   * Binds controller methods to window object for seamless inline HTML event handling.
   */
  bindGlobals() {
    if (typeof window === 'undefined') return;

    // Theme & UI
    window.applyTheme = (theme) => this.controllers.ui?.applyTheme(theme);
    window.toggleTheme = () => this.controllers.ui?.toggleTheme();
    window.showToast = (msg, type) => this.controllers.ui?.showToast(msg, type);
    window.getStarHTML = (rating) => this.controllers.ui?.getStarHTML(rating);

    // Auth
    window.checkAutoLogin = () => this.controllers.auth?.updateAuthUI();
    window.updateAuthUI = () => this.controllers.auth?.updateAuthUI();
    window.handleSignup = (e) => this.controllers.auth?.handleSignup(e);
    window.handleLogin = (e) => this.controllers.auth?.handleLogin(e);
    window.demoLogin = () => this.controllers.auth?.demoLogin();
    window.logoutUser = () => this.controllers.auth?.logoutUser();
    window.openLoginModal = () => this.controllers.auth?.openLoginModal();
    window.openSignupModal = () => this.controllers.auth?.openSignupModal();

    // Products
    window.renderProducts = () => this.controllers.product?.renderProducts();
    window.filterCategory = (cat, el) => this.controllers.product?.filterCategory(cat, el);
    window.handleSearch = (q) => this.controllers.product?.handleSearch(q);
    window.handleSort = (st) => this.controllers.product?.handleSort(st);
    window.resetFilters = () => this.controllers.product?.resetFilters();
    window.openQuickView = (id) => this.controllers.product?.openQuickView(id);
    window.adjustQuickViewQty = (d) => this.controllers.product?.adjustQuickViewQty(d);
    window.addFromQuickView = (id) => this.controllers.product?.addFromQuickView(id);
    window.toggleWishlist = (id, btn) => this.controllers.product?.toggleWishlist(id, btn);
    window.updateWishlistBadge = () => this.controllers.product?.updateWishlistBadge();

    // Cart
    window.addToCart = (id, qty) => this.controllers.cart?.addToCart(id, qty);
    window.updateCartQuantity = (id, d) => this.controllers.cart?.updateQuantity(id, d);
    window.removeFromCart = (id) => this.controllers.cart?.removeFromCart(id);
    window.clearCart = () => this.controllers.cart?.clearCart();
    window.saveCart = () => this.services.cart?.saveCart();
    window.updateCartBadge = (pulse) => this.controllers.cart?.updateCartBadge(pulse);
    window.calculateTotals = () => this.services.cart?.calculateTotals();
    window.renderCart = () => this.controllers.cart?.renderCart();
    window.applyPromoCode = () => this.controllers.cart?.applyPromoCode();

    // Reviews
    window.renderReviews = () => this.controllers.review?.renderReviews();
    window.setRatingStar = (v) => this.controllers.review?.setRatingStar(v);
    window.handleReviewSubmit = (e) => this.controllers.review?.handleReviewSubmit(e);

    // Checkout
    window.proceedToCheckout = () => this.controllers.checkout?.proceedToCheckout();
    window.selectPaymentMethod = (m, el) => this.controllers.checkout?.selectPaymentMethod(m, el);
    window.handleCheckoutSubmit = (e) => this.controllers.checkout?.handleCheckoutSubmit(e);
  }
}

const appModule = new AppModule();

if (typeof window !== 'undefined') {
  window.AppModule = AppModule;
  window.appModule = appModule;

  // Auto-bootstrap when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => appModule.bootstrap());
  } else {
    appModule.bootstrap();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AppModule, appModule };
}
