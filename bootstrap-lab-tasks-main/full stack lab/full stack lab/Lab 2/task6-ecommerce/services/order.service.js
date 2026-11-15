/**
 * ============================================================================
 * OrderService
 * ============================================================================
 * Handles checkout operations, invoice generation, order validation, payment
 * verification, and historical order logging.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class OrderService {
  constructor(storageServiceInstance) {
    this._storage = storageServiceInstance || (typeof window !== 'undefined' && window.storageService ? window.storageService : null);
    this._ordersKey = 'electro_orders';
    this._orders = [];
    this._loadOrders();
  }

  _loadOrders() {
    if (this._storage) {
      this._orders = this._storage.getItem(this._ordersKey, []);
    }
  }

  _saveOrders() {
    if (this._storage) {
      this._storage.setItem(this._ordersKey, this._orders);
    }
  }

  /**
   * Generates a unique, branded tracking invoice number.
   * @returns {string} E.g., 'EV-849102'
   */
  generateOrderId() {
    return 'EV-' + Math.floor(100000 + Math.random() * 900000);
  }

  /**
   * Validates customer shipping form fields.
   */
  validateShipping(shippingData) {
    if (!shippingData.fullName || !shippingData.fullName.trim()) {
      return { valid: false, message: "Full recipient name is required." };
    }
    if (!shippingData.email || !shippingData.email.includes('@')) {
      return { valid: false, message: "Valid delivery email is required." };
    }
    if (!shippingData.phone || !shippingData.phone.trim()) {
      return { valid: false, message: "Contact phone number is required." };
    }
    if (!shippingData.address || !shippingData.address.trim()) {
      return { valid: false, message: "Street delivery address is required." };
    }
    return { valid: true };
  }

  /**
   * Creates and stores a new order.
   * @param {Object} orderPayload
   */
  createOrder({ shipping, paymentMethod, items, totals, user } = {}) {
    if (!items || items.length === 0) {
      return { success: false, message: "Cannot place order with an empty cart." };
    }

    const validation = this.validateShipping(shipping || {});
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    const orderId = this.generateOrderId();
    const orderRecord = {
      orderId,
      createdAt: new Date().toISOString(),
      formattedDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customer: {
        name: shipping.fullName,
        email: shipping.email,
        phone: shipping.phone,
        address: `${shipping.address}, ${shipping.city || 'Islamabad'}`
      },
      payment: {
        method: paymentMethod || 'card',
        status: 'Confirmed'
      },
      items: [...items],
      totals: { ...totals },
      status: 'Processing'
    };

    this._orders.unshift(orderRecord);
    this._saveOrders();

    return {
      success: true,
      order: orderRecord,
      orderId,
      message: `Order #${orderId} confirmed successfully!`
    };
  }

  /**
   * Returns all placed orders.
   * @returns {Array}
   */
  getOrderHistory() {
    return [...this._orders];
  }

  /**
   * Retrieves an order by its tracking ID.
   */
  getOrderById(orderId) {
    return this._orders.find(o => o.orderId === orderId) || null;
  }
}

// Universal export
const orderService = new OrderService(typeof storageService !== 'undefined' ? storageService : null);

if (typeof window !== 'undefined') {
  window.OrderService = OrderService;
  window.orderService = orderService;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OrderService, orderService };
}
