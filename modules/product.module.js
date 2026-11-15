/**
 * ============================================================================
 * ProductModule
 * ============================================================================
 * Feature module encapsulating product catalog querying, category taxonomy,
 * search engine filtering, sorting, quick view, and wishlist operations.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class ProductModule {
  constructor(productServiceInstance, productControllerInstance) {
    this.service = productServiceInstance || (typeof window !== 'undefined' ? window.productService : null);
    this.controller = productControllerInstance || (typeof window !== 'undefined' ? window.productController : null);
  }

  init() {
    this.controller?.init();
  }

  getAllProducts() {
    return this.service?.getAllProducts();
  }

  getProductById(id) {
    return this.service?.getProductById(id);
  }

  getCategories() {
    return this.service?.getCategories();
  }

  filterProducts(criteria) {
    return this.service?.filterProducts(criteria);
  }
}

const productModule = new ProductModule(
  typeof productService !== 'undefined' ? productService : null,
  typeof productController !== 'undefined' ? productController : null
);

if (typeof window !== 'undefined') {
  window.ProductModule = ProductModule;
  window.productModule = productModule;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProductModule, productModule };
}
