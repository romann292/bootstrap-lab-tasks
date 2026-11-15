/**
 * ============================================================================
 * CartService
 * ============================================================================
 * Handles shopping cart business logic, mathematical calculations (subtotal,
 * 5% tax, tiered shipping, promo discounts, grand total), cart state mutations,
 * promo code redemption, and wishlist management.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class CartService {
  constructor(storageServiceInstance, productServiceInstance) {
    this._storage = storageServiceInstance || (typeof window !== 'undefined' && window.storageService ? window.storageService : null);
    this._productService = productServiceInstance || (typeof window !== 'undefined' && window.productService ? window.productService : null);

    this._cartKey = 'electro_cart';
    this._promoKey = 'electro_promo';
    this._wishlistKey = 'electro_wishlist';

    this._cart = [];
    this._appliedPromo = null;
    this._wishlist = [];

    this._promoCodes = {
      'AU2026': { percent: 15, name: "Air University Student Discount (15% OFF)" },
      'NOVA10': { percent: 10, name: "Welcome Promo (10% OFF)" },
      'SALE20': { percent: 20, name: "Flash Sale Promo (20% OFF)" }
    };

    this.loadState();
  }

  loadState() {
    if (this._storage) {
      this._cart = this._storage.getItem(this._cartKey, []);
      this._appliedPromo = this._storage.getItem(this._promoKey, null);
      this._wishlist = this._storage.getItem(this._wishlistKey, []);
    }
  }

  saveCart() {
    if (this._storage) {
      this._storage.setItem(this._cartKey, this._cart);
    }
  }

  savePromo() {
    if (this._storage) {
      if (this._appliedPromo) {
        this._storage.setItem(this._promoKey, this._appliedPromo);
      } else {
        this._storage.removeItem(this._promoKey);
      }
    }
  }

  saveWishlist() {
    if (this._storage) {
      this._storage.setItem(this._wishlistKey, this._wishlist);
    }
  }

  /**
   * Retrieves active items in cart.
   * @returns {Array}
   */
  getCartItems() {
    return [...this._cart];
  }

  /**
   * Returns total unit count in cart.
   * @returns {number}
   */
  getItemCount() {
    return this._cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Adds an item to the shopping cart.
   * @param {number|string} productId
   * @param {number} quantity
   * @returns {{ success: boolean, item?: Object, message: string }}
   */
  addToCart(productId, quantity = 1) {
    const numId = parseInt(productId, 10);
    const product = this._productService ? this._productService.getProductById(numId) : null;

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const existing = this._cart.find(item => item.id === numId);

    if (existing) {
      existing.quantity += qty;
    } else {
      this._cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        categoryLabel: product.categoryLabel,
        quantity: qty
      });
    }

    this.saveCart();
    return {
      success: true,
      item: product,
      quantity: qty,
      message: `Added ${qty > 1 ? qty + 'x ' : ''}"${product.name}" to Cart! 🛒`
    };
  }

  /**
   * Updates item quantity by delta (+1 or -1).
   * @param {number|string} productId
   * @param {number} delta
   */
  updateQuantity(productId, delta) {
    const numId = parseInt(productId, 10);
    const item = this._cart.find(i => i.id === numId);
    if (!item) return { success: false, message: "Item not in cart" };

    item.quantity += delta;
    if (item.quantity <= 0) {
      return this.removeFromCart(numId);
    }

    this.saveCart();
    return { success: true, item, message: "Cart quantity updated" };
  }

  /**
   * Removes specific product from cart.
   * @param {number|string} productId
   */
  removeFromCart(productId) {
    const numId = parseInt(productId, 10);
    const removedItem = this._cart.find(i => i.id === numId);
    this._cart = this._cart.filter(i => i.id !== numId);
    this.saveCart();
    return {
      success: true,
      item: removedItem,
      message: removedItem ? `Removed "${removedItem.name}" from Cart` : "Item removed"
    };
  }

  /**
   * Clears entire cart and removes promo.
   */
  clearCart() {
    this._cart = [];
    this._appliedPromo = null;
    this.saveCart();
    this.savePromo();
    return { success: true, message: "Your cart has been cleared" };
  }

  /**
   * Calculates subtotal, tax, shipping, discount, and grand total.
   * @returns {{ subtotal: number, tax: number, shipping: number, discount: number, grandTotal: number }}
   */
  calculateTotals() {
    const subtotal = this._cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05; // 5% sales tax
    // Free shipping above $99 or if empty
    const shipping = subtotal > 99 || subtotal === 0 ? 0 : 15;

    let discount = 0;
    if (this._appliedPromo) {
      discount = (subtotal * this._appliedPromo.percent) / 100;
    }

    const grandTotal = Math.max(0, subtotal + tax + shipping - discount);
    return { subtotal, tax, shipping, discount, grandTotal };
  }

  /**
   * Validates and applies a coupon promo code.
   * @param {string} code
   */
  applyPromoCode(code) {
    if (!code || !code.trim()) {
      return { success: false, message: "Please enter a valid promo code." };
    }
    const cleanCode = code.trim().toUpperCase();
    const promo = this._promoCodes[cleanCode];

    if (promo) {
      this._appliedPromo = { code: cleanCode, ...promo };
      this.savePromo();
      return { success: true, promo: this._appliedPromo, message: `Promo Applied! ${promo.name} 🎉` };
    }

    return { success: false, message: "Invalid Promo Code! Try 'AU2026' or 'NOVA10'." };
  }

  getAppliedPromo() {
    return this._appliedPromo;
  }

  // --- Wishlist operations ---
  getWishlist() {
    return [...this._wishlist];
  }

  isWishlisted(productId) {
    return this._wishlist.includes(parseInt(productId, 10));
  }

  toggleWishlist(productId) {
    const numId = parseInt(productId, 10);
    const idx = this._wishlist.indexOf(numId);
    let isNowWishlisted = false;

    if (idx === -1) {
      this._wishlist.push(numId);
      isNowWishlisted = true;
    } else {
      this._wishlist.splice(idx, 1);
      isNowWishlisted = false;
    }

    this.saveWishlist();
    return {
      success: true,
      wishlisted: isNowWishlisted,
      count: this._wishlist.length,
      message: isNowWishlisted ? "Added to Wishlist! ❤️" : "Removed from Wishlist"
    };
  }
}

// Universal export
const cartService = new CartService(
  typeof storageService !== 'undefined' ? storageService : null,
  typeof productService !== 'undefined' ? productService : null
);

if (typeof window !== 'undefined') {
  window.CartService = CartService;
  window.cartService = cartService;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CartService, cartService };
}
