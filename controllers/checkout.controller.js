/**
 * ============================================================================
 * CheckoutController
 * ============================================================================
 * Controls the checkout modal dialog, payment method selection, shipping
 * address form submission, order receipt generation, and cart resets.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class CheckoutController {
  constructor(orderServiceInstance, cartServiceInstance, authServiceInstance, uiControllerInstance) {
    this._orderService = orderServiceInstance || (typeof window !== 'undefined' && window.orderService ? window.orderService : null);
    this._cartService = cartServiceInstance || (typeof window !== 'undefined' && window.cartService ? window.cartService : null);
    this._authService = authServiceInstance || (typeof window !== 'undefined' && window.authService ? window.authService : null);
    this._uiController = uiControllerInstance || (typeof window !== 'undefined' && window.uiController ? window.uiController : null);

    this._selectedPaymentMethod = 'card';
  }

  init() {
    // Ready for checkout triggers
  }

  /**
   * Opens the checkout modal dialog and prepares order summary.
   */
  proceedToCheckout() {
    if (!this._cartService) return;
    if (this._cartService.getItemCount() === 0) {
      this._uiController?.showToast("Your cart is empty! Add products first.", "warning");
      return;
    }

    // Close Cart Offcanvas drawer
    if (typeof document !== 'undefined') {
      const offcanvasEl = document.getElementById('cartOffcanvas');
      if (offcanvasEl && typeof bootstrap !== 'undefined') {
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvas) offcanvas.hide();
      }

      // Populate checkout summary total
      const totals = this._cartService.calculateTotals();
      const summaryTotal = document.getElementById('checkoutSummaryTotal');
      if (summaryTotal) {
        summaryTotal.textContent = `$${totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }

      // Autofill authenticated user info
      const user = this._authService ? this._authService.getCurrentUser() : null;
      if (user) {
        const nameInput = document.getElementById('shippingFullName');
        const emailInput = document.getElementById('shippingEmail');
        const phoneInput = document.getElementById('shippingPhone');

        if (nameInput) nameInput.value = user.name || "Roman Fatima";
        if (emailInput) emailInput.value = user.email || "roman.fatima@students.au.edu.pk";
        if (phoneInput) phoneInput.value = user.phone || "+92 300 1234567";
      }

      const modalEl = document.getElementById('checkoutModal');
      if (modalEl && typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    }
  }

  /**
   * Handles payment method selection card toggles.
   * @param {string} method - 'card', 'jazzcash', 'easypaisa', 'cod'
   * @param {HTMLElement} cardEl
   */
  selectPaymentMethod(method, cardEl) {
    this._selectedPaymentMethod = method;

    if (typeof document !== 'undefined') {
      document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('selected'));
      if (cardEl) {
        cardEl.classList.add('selected');
        const radio = cardEl.querySelector('input[type=radio]');
        if (radio) radio.checked = true;
      }

      const cardDetails = document.getElementById('cardDetailsFields');
      const mobileDetails = document.getElementById('mobileWalletFields');
      const codDetails = document.getElementById('codDetailsMessage');

      if (cardDetails) cardDetails.classList.add('d-none');
      if (mobileDetails) mobileDetails.classList.add('d-none');
      if (codDetails) codDetails.classList.add('d-none');

      if (method === 'card' && cardDetails) cardDetails.classList.remove('d-none');
      else if ((method === 'jazzcash' || method === 'easypaisa') && mobileDetails) mobileDetails.classList.remove('d-none');
      else if (method === 'cod' && codDetails) codDetails.classList.remove('d-none');
    }
  }

  /**
   * Handles checkout form submission, calls OrderService, and displays invoice.
   */
  handleCheckoutSubmit(e) {
    if (e) e.preventDefault();
    if (typeof document === 'undefined') return;

    const btn = document.getElementById('placeOrderBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span>Processing Order...`;
    }

    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i class="bi bi-lock-fill me-1"></i> Place Order &amp; Pay`;
      }

      const checkoutModalEl = document.getElementById('checkoutModal');
      if (checkoutModalEl && typeof bootstrap !== 'undefined') {
        const checkoutModal = bootstrap.Modal.getInstance(checkoutModalEl);
        if (checkoutModal) checkoutModal.hide();
      }

      const shipping = {
        fullName: document.getElementById('shippingFullName')?.value || 'Roman Fatima',
        email: document.getElementById('shippingEmail')?.value || 'roman.fatima@students.au.edu.pk',
        phone: document.getElementById('shippingPhone')?.value || '+92 300 1234567',
        address: document.getElementById('shippingAddress')?.value || 'Sector E-9, Air University Campus',
        city: document.getElementById('shippingCity')?.value || 'Islamabad'
      };

      const items = this._cartService ? this._cartService.getCartItems() : [];
      const totals = this._cartService ? this._cartService.calculateTotals() : { grandTotal: 0 };
      const user = this._authService ? this._authService.getCurrentUser() : null;

      const orderResult = this._orderService ? this._orderService.createOrder({
        shipping,
        paymentMethod: this._selectedPaymentMethod,
        items,
        totals,
        user
      }) : { success: true, orderId: 'EV-' + Math.floor(100000 + Math.random() * 900000) };

      // Clear cart upon successful order
      if (this._cartService) {
        this._cartService.clearCart();
      }
      if (typeof cartController !== 'undefined') {
        cartController.renderCart();
        cartController.updateCartBadge();
      }

      // Populate confirmation receipt modal
      const confirmOrderId = document.getElementById('confirmOrderId');
      const confirmTotal = document.getElementById('confirmTotal');
      const confirmItemsCount = document.getElementById('confirmItemsCount');
      const itemsList = document.getElementById('confirmItemsList');

      if (confirmOrderId) confirmOrderId.textContent = orderResult.orderId;
      if (confirmTotal) confirmTotal.textContent = `$${totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (confirmItemsCount) confirmItemsCount.textContent = `${items.reduce((s, i) => s + i.quantity, 0)} items`;

      if (itemsList) {
        itemsList.innerHTML = items.map(item => `
          <li class="d-flex justify-content-between align-items-center mb-1">
            <span class="small">${item.quantity}x ${item.name}</span>
            <span class="small fw-bold">$${(item.price * item.quantity).toLocaleString()}</span>
          </li>
        `).join('');
      }

      const confirmModalEl = document.getElementById('orderSuccessModal');
      if (confirmModalEl && typeof bootstrap !== 'undefined') {
        const confirmModal = new bootstrap.Modal(confirmModalEl);
        confirmModal.show();
      }

      this._uiController?.showToast(`Order Placed Successfully! Tracking: #${orderResult.orderId} 📦`, "success");
    }, 1200);
  }
}

// Universal export
const checkoutController = new CheckoutController(
  typeof orderService !== 'undefined' ? orderService : null,
  typeof cartService !== 'undefined' ? cartService : null,
  typeof authService !== 'undefined' ? authService : null,
  typeof uiController !== 'undefined' ? uiController : null
);

if (typeof window !== 'undefined') {
  window.CheckoutController = CheckoutController;
  window.checkoutController = checkoutController;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CheckoutController, checkoutController };
}
