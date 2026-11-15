/**
 * ============================================================================
 * CartModule
 * ============================================================================
 * Feature module encapsulating shopping cart management, calculations,
 * quantities, offcanvas view rendering, and coupon discount redemption.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class CartModule {
  constructor(cartServiceInstance, cartControllerInstance) {
    this.service = cartServiceInstance || (typeof window !== 'undefined' ? window.cartService : null);
    this.controller = cartControllerInstance || (typeof window !== 'undefined' ? window.cartController : null);
  }

  init() {
    this.controller?.init();
  }

  getCartItems() {
    return this.service?.getCartItems();
  }

  addToCart(productId, qty) {
    return this.controller?.addToCart(productId, qty);
  }

  calculateTotals() {
    return this.service?.calculateTotals();
  }

  clearCart() {
    return this.service?.clearCart();
  }
}

const cartModule = new CartModule(
  typeof cartService !== 'undefined' ? cartService : null,
  typeof cartController !== 'undefined' ? cartController : null
);

if (typeof window !== 'undefined') {
  window.CartModule = CartModule;
  window.cartModule = cartModule;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CartModule, cartModule };
}
