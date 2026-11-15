/**
 * ============================================================================
 * CheckoutModule
 * ============================================================================
 * Feature module encapsulating checkout steps, payment options, order creation,
 * and invoice confirmations.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class CheckoutModule {
  constructor(orderServiceInstance, checkoutControllerInstance) {
    this.service = orderServiceInstance || (typeof window !== 'undefined' ? window.orderService : null);
    this.controller = checkoutControllerInstance || (typeof window !== 'undefined' ? window.checkoutController : null);
  }

  init() {
    this.controller?.init();
  }

  proceedToCheckout() {
    this.controller?.proceedToCheckout();
  }

  getOrderHistory() {
    return this.service?.getOrderHistory();
  }
}

const checkoutModule = new CheckoutModule(
  typeof orderService !== 'undefined' ? orderService : null,
  typeof checkoutController !== 'undefined' ? checkoutController : null
);

if (typeof window !== 'undefined') {
  window.CheckoutModule = CheckoutModule;
  window.checkoutModule = checkoutModule;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CheckoutModule, checkoutModule };
}
