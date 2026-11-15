/**
 * ============================================================================
 * CartController
 * ============================================================================
 * Controls the Shopping Cart Offcanvas drawer, item list rendering, quantity
 * adjustments (+ / -), item deletions, badge pulse animations, and promo
 * code submissions.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class CartController {
  constructor(cartServiceInstance, uiControllerInstance) {
    this._cartService = cartServiceInstance || (typeof window !== 'undefined' && window.cartService ? window.cartService : null);
    this._uiController = uiControllerInstance || (typeof window !== 'undefined' && window.uiController ? window.uiController : null);
  }

  init() {
    this.renderCart();
    this.updateCartBadge();
  }

  /**
   * Adds an item to the shopping cart, pulses badge, and updates UI.
   * @param {number|string} productId
   * @param {number} quantity
   */
  addToCart(productId, quantity = 1) {
    if (!this._cartService) return;
    const res = this._cartService.addToCart(productId, quantity);

    if (res.success) {
      this.renderCart();
      this.updateCartBadge(true);

      // Button feedback animation
      if (typeof document !== 'undefined') {
        const btn = document.getElementById(`addBtn-${productId}`);
        if (btn) {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<i class="bi bi-check-lg"></i> Added!';
          btn.classList.add('btn-success');
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('btn-success');
          }, 1200);
        }
      }

      this._uiController?.showToast(res.message, 'success');
    } else {
      this._uiController?.showToast(res.message, 'warning');
    }
  }

  /**
   * Increments or decrements item quantity.
   */
  updateQuantity(productId, delta) {
    if (!this._cartService) return;
    this._cartService.updateQuantity(productId, delta);
    this.renderCart();
    this.updateCartBadge();
  }

  /**
   * Removes specific item from cart.
   */
  removeFromCart(productId) {
    if (!this._cartService) return;
    const res = this._cartService.removeFromCart(productId);
    this.renderCart();
    this.updateCartBadge();
    this._uiController?.showToast(res.message, 'info');
  }

  /**
   * Clears entire cart contents.
   */
  clearCart() {
    if (!this._cartService) return;
    if (this._cartService.getItemCount() === 0) return;
    const res = this._cartService.clearCart();
    this.renderCart();
    this.updateCartBadge();
    this._uiController?.showToast(res.message, 'info');
  }

  /**
   * Updates cart item badge in navbar with optional pulse effect.
   */
  updateCartBadge(pulse = false) {
    if (typeof document === 'undefined' || !this._cartService) return;
    const badge = document.getElementById('cartBadge');
    if (!badge) return;

    badge.textContent = this._cartService.getItemCount();
    if (pulse) {
      badge.classList.remove('pulse-badge');
      void badge.offsetWidth; // Trigger reflow
      badge.classList.add('pulse-badge');
    }
  }

  /**
   * Renders cart offcanvas items and calculates financial summary.
   */
  renderCart() {
    if (typeof document === 'undefined' || !this._cartService) return;
    const itemsContainer = document.getElementById('cartItemsList');
    const emptyState = document.getElementById('cartEmptyState');
    const footer = document.getElementById('cartFooter');
    if (!itemsContainer) return;

    const items = this._cartService.getCartItems();

    if (items.length === 0) {
      itemsContainer.innerHTML = '';
      if (emptyState) emptyState.classList.remove('d-none');
      if (footer) footer.classList.add('d-none');
      return;
    }

    if (emptyState) emptyState.classList.add('d-none');
    if (footer) footer.classList.remove('d-none');

    itemsContainer.innerHTML = items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://placehold.co/100/1e293b/ffffff?text=Tech'">
        <div class="flex-grow-1">
          <div class="cart-item-title">${item.name}</div>
          <div class="d-flex align-items-center justify-content-between mt-2">
            <div class="cart-item-price">$${(item.price * item.quantity).toLocaleString()} <span class="text-muted small fw-normal">($${item.price.toLocaleString()} ea)</span></div>
            <div class="d-flex align-items-center gap-2">
              <div class="quantity-stepper">
                <button class="qty-btn" onclick="cartController.updateQuantity(${item.id}, -1)">-</button>
                <span class="qty-num">${item.quantity}</span>
                <button class="qty-btn" onclick="cartController.updateQuantity(${item.id}, 1)">+</button>
              </div>
              <button class="remove-item-btn" onclick="cartController.removeFromCart(${item.id})" title="Remove item">
                <i class="bi bi-trash3-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Summary calculations
    const totals = this._cartService.calculateTotals();
    const subtotalEl = document.getElementById('cartSubtotal');
    const taxEl = document.getElementById('cartTax');
    const shippingEl = document.getElementById('cartShipping');
    const grandTotalEl = document.getElementById('cartGrandTotal');
    const discountRow = document.getElementById('cartDiscountRow');
    const discountEl = document.getElementById('cartDiscount');

    if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (taxEl) taxEl.textContent = `$${totals.tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`;

    if (discountRow && discountEl) {
      if (totals.discount > 0) {
        discountRow.classList.remove('d-none');
        discountEl.textContent = `-$${totals.discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else {
        discountRow.classList.add('d-none');
      }
    }

    if (grandTotalEl) grandTotalEl.textContent = `$${totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  /**
   * Applies coupon code from input.
   */
  applyPromoCode() {
    if (typeof document === 'undefined' || !this._cartService) return;
    const input = document.getElementById('promoCodeInput');
    if (!input) return;

    const res = this._cartService.applyPromoCode(input.value);
    if (res.success) {
      this.renderCart();
      this._uiController?.showToast(res.message, 'success');
    } else {
      this._uiController?.showToast(res.message, 'danger');
    }
  }
}

// Universal export
const cartController = new CartController(
  typeof cartService !== 'undefined' ? cartService : null,
  typeof uiController !== 'undefined' ? uiController : null
);

if (typeof window !== 'undefined') {
  window.CartController = CartController;
  window.cartController = cartController;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CartController, cartController };
}
