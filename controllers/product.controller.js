/**
 * ============================================================================
 * ProductController
 * ============================================================================
 * Controls product catalog presentation, manages product grid DOM updates,
 * handles category filtering, search input queries, sorting selection,
 * quick view modal inspection, and wishlist heart toggles.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class ProductController {
  constructor(productServiceInstance, cartServiceInstance, uiControllerInstance) {
    this._productService = productServiceInstance || (typeof window !== 'undefined' && window.productService ? window.productService : null);
    this._cartService = cartServiceInstance || (typeof window !== 'undefined' && window.cartService ? window.cartService : null);
    this._uiController = uiControllerInstance || (typeof window !== 'undefined' && window.uiController ? window.uiController : null);

    this._activeCategory = 'all';
    this._searchQuery = '';
    this._sortBy = 'featured';
  }

  init() {
    this.renderProducts();
    this.updateWishlistBadge();
    this._bindSearchInput();
  }

  _bindSearchInput() {
    if (typeof document === 'undefined') return;
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }
  }

  /**
   * Renders the product grid in the DOM according to active filters.
   */
  renderProducts() {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('productsGrid');
    if (!container || !this._productService) return;

    const filtered = this._productService.filterProducts({
      category: this._activeCategory,
      searchQuery: this._searchQuery,
      sortBy: this._sortBy
    });

    const countEl = document.getElementById('productsCount');
    if (countEl) countEl.textContent = `${filtered.length} products found`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-12 py-5 text-center">
          <i class="bi bi-search text-muted display-3 mb-3 d-block"></i>
          <h4 class="fw-bold">No products found</h4>
          <p class="text-muted">Try clearing your search query or choosing another category filter.</p>
          <button class="btn btn-primary btn-sm px-4" onclick="productController.resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(product => {
      const isWishlisted = this._cartService ? this._cartService.isWishlisted(product.id) : false;
      const starHtml = this._uiController ? this._uiController.getStarHTML(product.rating) : '★★★★★';

      return `
        <div class="col-sm-6 col-lg-4 col-xl-3">
          <div class="product-card">
            <!-- Badges -->
            <div class="product-badge-wrap">
              <span class="badge ${product.badgeColor} fw-semibold shadow-sm">${product.badge}</span>
              <span class="badge bg-danger fw-semibold shadow-sm">${product.discount}</span>
            </div>

            <!-- Wishlist Button -->
            <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" 
                    onclick="productController.toggleWishlist(${product.id}, this)" 
                    title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
              <i class="bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}"></i>
            </button>

            <!-- Product Image & Quick View -->
            <div class="product-img-wrap">
              <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.src='https://placehold.co/600x400/1e293b/ffffff?text=${encodeURIComponent(product.name)}'">
              <div class="quick-view-overlay">
                <button class="btn btn-light btn-sm fw-semibold rounded-pill px-3 shadow" onclick="productController.openQuickView(${product.id})">
                  <i class="bi bi-eye me-1"></i>Quick View
                </button>
              </div>
            </div>

            <!-- Product Body -->
            <div class="product-body">
              <div class="product-cat">${product.categoryLabel}</div>
              <h3 class="product-title" title="${product.name}">${product.name}</h3>

              <!-- Rating -->
              <div class="product-rating">
                <div class="stars">
                  ${starHtml}
                </div>
                <span class="fw-bold text-dark dark-text-light ms-1">${product.rating}</span>
                <span class="rating-count">(${product.reviewsCount})</span>
              </div>

              <!-- Price -->
              <div class="price-wrap">
                <span class="product-price">$${product.price.toLocaleString()}</span>
                <span class="product-old-price">$${product.oldPrice.toLocaleString()}</span>
              </div>

              <!-- Add to Cart CTA -->
              <button class="btn-add-cart" id="addBtn-${product.id}" onclick="cartController.addToCart(${product.id})">
                <i class="bi bi-cart-plus-fill fs-6"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Filters product display by category pill click.
   */
  filterCategory(cat, element) {
    this._activeCategory = cat;
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.category-pill').forEach(el => el.classList.remove('active'));
      if (element) element.classList.add('active');
    }
    this.renderProducts();
  }

  /**
   * Updates search query keyword and filters products.
   */
  handleSearch(query) {
    this._searchQuery = query;
    this.renderProducts();
  }

  /**
   * Changes sort criteria.
   */
  handleSort(sortType) {
    this._sortBy = sortType;
    this.renderProducts();
  }

  /**
   * Resets all search and category filters to default.
   */
  resetFilters() {
    this._activeCategory = 'all';
    this._searchQuery = '';
    this._sortBy = 'featured';
    if (typeof document !== 'undefined') {
      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.value = '';
      document.querySelectorAll('.category-pill').forEach(el => {
        el.classList.toggle('active', el.dataset.category === 'all');
      });
    }
    this.renderProducts();
  }

  /**
   * Opens the Quick View preview modal for a product.
   */
  openQuickView(productId) {
    if (typeof document === 'undefined' || !this._productService) return;
    const product = this._productService.getProductById(productId);
    if (!product) return;

    const modalBody = document.getElementById('quickViewContent');
    if (!modalBody) return;

    const starHtml = this._uiController ? this._uiController.getStarHTML(product.rating) : '★★★★★';
    const savings = this._productService.calculateSavings(product.oldPrice, product.price);

    modalBody.innerHTML = `
      <div class="row g-4 align-items-center">
        <div class="col-md-6 text-center">
          <div class="p-3 bg-body-tertiary rounded-4">
            <img src="${product.image}" alt="${product.name}" class="img-fluid rounded-3" style="max-height:300px;object-fit:contain;">
          </div>
        </div>
        <div class="col-md-6">
          <span class="badge ${product.badgeColor} mb-2">${product.badge}</span>
          <span class="badge bg-danger mb-2">${product.discount}</span>
          <div class="text-uppercase small text-primary fw-bold mb-1">${product.categoryLabel}</div>
          <h4 class="fw-bold mb-2">${product.name}</h4>
          
          <div class="d-flex align-items-center gap-2 mb-3">
            <div class="text-warning">${starHtml}</div>
            <span class="fw-bold">${product.rating}</span>
            <span class="text-muted small">(${product.reviewsCount} customer reviews)</span>
          </div>

          <div class="d-flex align-items-baseline gap-3 mb-3">
            <span class="fs-3 fw-bold text-primary">$${product.price.toLocaleString()}</span>
            <span class="text-muted text-decoration-line-through fs-5">$${product.oldPrice.toLocaleString()}</span>
            <span class="badge bg-success-subtle text-success border border-success-subtle">Save $${savings.toLocaleString()}</span>
          </div>

          <p class="text-muted small mb-3">${product.description}</p>

          <h6 class="fw-bold mb-2 small text-uppercase letter-spacing-1">Key Specifications:</h6>
          <ul class="list-unstyled small mb-4">
            ${product.specs.map(spec => `<li class="mb-1"><i class="bi bi-check-circle-fill text-success me-2"></i>${spec}</li>`).join('')}
          </ul>

          <div class="d-flex gap-3">
            <div class="quantity-stepper">
              <button class="qty-btn" onclick="productController.adjustQuickViewQty(-1)">-</button>
              <span class="qty-num" id="quickViewQty">1</span>
              <button class="qty-btn" onclick="productController.adjustQuickViewQty(1)">+</button>
            </div>
            <button class="btn btn-primary flex-grow-1 fw-semibold d-flex align-items-center justify-content-center gap-2" onclick="productController.addFromQuickView(${product.id})">
              <i class="bi bi-cart-plus-fill"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;

    if (typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
      modal.show();
    }
  }

  adjustQuickViewQty(delta) {
    if (typeof document === 'undefined') return;
    const qtyEl = document.getElementById('quickViewQty');
    if (!qtyEl) return;
    let val = parseInt(qtyEl.textContent, 10) + delta;
    if (val < 1) val = 1;
    qtyEl.textContent = val;
  }

  addFromQuickView(productId) {
    if (typeof document === 'undefined') return;
    const qtyEl = document.getElementById('quickViewQty');
    const qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
    if (typeof cartController !== 'undefined') {
      cartController.addToCart(productId, qty);
    }
    const modalEl = document.getElementById('quickViewModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  }

  toggleWishlist(productId, btn) {
    if (!this._cartService) return;
    const res = this._cartService.toggleWishlist(productId);

    if (btn) {
      if (res.wishlisted) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="bi bi-heart-fill"></i>';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="bi bi-heart"></i>';
      }
    }
    this.updateWishlistBadge();
    this._uiController?.showToast(res.message, res.wishlisted ? 'success' : 'info');
  }

  updateWishlistBadge() {
    if (typeof document === 'undefined' || !this._cartService) return;
    const badge = document.getElementById('wishlistBadge');
    if (badge) {
      badge.textContent = this._cartService.getWishlist().length;
    }
  }
}

// Universal export
const productController = new ProductController(
  typeof productService !== 'undefined' ? productService : null,
  typeof cartService !== 'undefined' ? cartService : null,
  typeof uiController !== 'undefined' ? uiController : null
);

if (typeof window !== 'undefined') {
  window.ProductController = ProductController;
  window.productController = productController;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProductController, productController };
}
