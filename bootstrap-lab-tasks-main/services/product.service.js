/**
 * ============================================================================
 * ProductService
 * ============================================================================
 * Encapsulates all product catalog data, business logic, search algorithms,
 * category filtering, and sorting calculations.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class ProductService {
  constructor() {
    this._products = [
      {
        id: 1,
        name: "Apple MacBook Pro 16\" M3 Max",
        category: "laptops",
        categoryLabel: "Laptops",
        price: 3499,
        oldPrice: 3999,
        discount: "12% OFF",
        rating: 4.9,
        reviewsCount: 342,
        badge: "Bestseller",
        badgeColor: "bg-warning text-dark",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80",
        description: "Equipped with the groundbreaking M3 Max chip, 36GB unified memory, and Liquid Retina XDR display with ProMotion 120Hz.",
        specs: ["Apple M3 Max 16-Core CPU", "40-Core GPU, 36GB RAM", "1TB Ultra-Fast SSD", "22-hour battery life", "Liquid Retina XDR Display"],
        inStock: true
      },
      {
        id: 2,
        name: "Sony WH-1000XM5 ANC Headphones",
        category: "audio",
        categoryLabel: "Audio",
        price: 399,
        oldPrice: 479,
        discount: "17% OFF",
        rating: 4.8,
        reviewsCount: 512,
        badge: "Top Rated",
        badgeColor: "bg-primary text-white",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
        description: "Industry-leading noise canceling with 8 microphones, Auto NC Optimizer, and crystal-clear hands-free calling with 30-hour battery.",
        specs: ["Dual processors ANC", "30-hr battery life", "Multipoint connection", "Hi-Res LDAC Audio", "Lightweight ergonomic design"],
        inStock: true
      },
      {
        id: 3,
        name: "Apple iPhone 16 Pro Max 256GB",
        category: "smartphones",
        categoryLabel: "Smartphones",
        price: 1199,
        oldPrice: 1299,
        discount: "8% OFF",
        rating: 4.9,
        reviewsCount: 684,
        badge: "New Arrival",
        badgeColor: "bg-success text-white",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=700&q=80",
        description: "Forged in grade 5 titanium with the revolutionary A18 Pro chip, 48MP Fusion camera system with 5x Telephoto optical zoom.",
        specs: ["A18 Pro Bionic chip", "6.9-inch Super Retina XDR", "48MP Triple Camera", "Action Button & Camera Control", "All-day battery life"],
        inStock: true
      },
      {
        id: 4,
        name: "Apple Watch Ultra 2 Titanium 49mm",
        category: "wearables",
        categoryLabel: "Wearables",
        price: 799,
        oldPrice: 899,
        discount: "11% OFF",
        rating: 4.9,
        reviewsCount: 220,
        badge: "Rugged Pro",
        badgeColor: "bg-dark text-white",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
        description: "The most rugged and capable Apple Watch ever. Corrosion-resistant titanium case, precision dual-frequency GPS, and up to 36 hours of battery.",
        specs: ["49mm Titanium Case", "3000 nits display brightness", "Precision Dual-frequency GPS", "Depth gauge to 40m", "100m water resistant"],
        inStock: true
      },
      {
        id: 5,
        name: "Sony Alpha A7 IV Full-Frame Camera",
        category: "cameras",
        categoryLabel: "Cameras",
        price: 2498,
        oldPrice: 2699,
        discount: "7% OFF",
        rating: 4.9,
        reviewsCount: 189,
        badge: "Creator Choice",
        badgeColor: "bg-info text-dark",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80",
        description: "33MP Full-Frame Exmor R CMOS sensor, 4K 60p video, 10-bit 4:2:2 recording, Real-time Eye AF for humans, animals, and birds.",
        specs: ["33MP BSI CMOS Sensor", "BIONZ XR processor", "4K 60p 10-bit recording", "759-pt phase-detect AF", "5.5-stop In-body Image Stabilization"],
        inStock: true
      },
      {
        id: 6,
        name: "Keychron Q1 Pro Wireless Mechanical",
        category: "peripherals",
        categoryLabel: "Peripherals",
        price: 199,
        oldPrice: 239,
        discount: "16% OFF",
        rating: 4.7,
        reviewsCount: 145,
        badge: "Custom Grade",
        badgeColor: "bg-secondary text-white",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80",
        description: "Full aluminum CNC body, 75% layout, hot-swappable Keychron K Pro switches, double-gasket design, and QMK/VIA programmable.",
        specs: ["CNC Machined Aluminum", "Bluetooth 5.1 & Type-C", "Hot-swappable switches", "RGB South-facing backlight", "Compatible with Mac & Windows"],
        inStock: true
      },
      {
        id: 7,
        name: "Dell XPS 15 9530 OLED Touch",
        category: "laptops",
        categoryLabel: "Laptops",
        price: 2199,
        oldPrice: 2599,
        discount: "15% OFF",
        rating: 4.7,
        reviewsCount: 260,
        badge: "Sale",
        badgeColor: "bg-danger text-white",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=700&q=80",
        description: "13th Gen Intel Core i9-13900H, NVIDIA RTX 4070, 32GB DDR5, 1TB NVMe, 3.5K OLED InfinityEdge touch screen.",
        specs: ["Intel Core i9-13900H", "NVIDIA RTX 4070 8GB", "3.5K OLED Touchscreen", "32GB DDR5 4800MHz", "Carbon fiber palm rest"],
        inStock: true
      },
      {
        id: 8,
        name: "Bose QuietComfort Ultra Soundbar",
        category: "audio",
        categoryLabel: "Audio",
        price: 899,
        oldPrice: 999,
        discount: "10% OFF",
        rating: 4.8,
        reviewsCount: 178,
        badge: "Dolby Atmos",
        badgeColor: "bg-primary text-white",
        image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=700&q=80",
        description: "Immersive spatial audio with Dolby Atmos and proprietary TrueSpace technology for room-filling theater sound.",
        specs: ["Dolby Atmos & Spatial Audio", "Voice4Video voice control", "Wi-Fi & Bluetooth streaming", "HDMI eARC connectivity", "ADAPTiQ audio calibration"],
        inStock: true
      },
      {
        id: 9,
        name: "Samsung Galaxy S24 Ultra 512GB",
        category: "smartphones",
        categoryLabel: "Smartphones",
        price: 1299,
        oldPrice: 1419,
        discount: "8% OFF",
        rating: 4.8,
        reviewsCount: 430,
        badge: "AI Powered",
        badgeColor: "bg-info text-dark",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=80",
        description: "Titanium exterior, Galaxy AI features with Circle to Search, 200MP camera with Quad Telephoto system, and built-in S Pen.",
        specs: ["Snapdragon 8 Gen 3 for Galaxy", "200MP Quad-Telephoto", "Built-in S Pen Stylus", "6.8\" Dynamic AMOLED 2X", "5000 mAh All-day Battery"],
        inStock: true
      },
      {
        id: 10,
        name: "Logitech MX Master 3S Ergonomic Mouse",
        category: "peripherals",
        categoryLabel: "Peripherals",
        price: 99,
        oldPrice: 129,
        discount: "23% OFF",
        rating: 4.9,
        reviewsCount: 920,
        badge: "Best Value",
        badgeColor: "bg-success text-white",
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=700&q=80",
        description: "Quiet Click technology, 8,000 DPI track-on-glass sensor, MagSpeed electromagnetic scroll wheel, and ergonomic sculpted silhouette.",
        specs: ["8000 DPI Darkfield Sensor", "MagSpeed 1000 lines/sec scroll", "Quiet Click sound reduction", "Multi-device Flow control", "70-day battery on full charge"],
        inStock: true
      },
      {
        id: 11,
        name: "Apple iPad Pro 13\" M4 OLED",
        category: "laptops",
        categoryLabel: "Tablets",
        price: 1299,
        oldPrice: 1399,
        discount: "7% OFF",
        rating: 4.9,
        reviewsCount: 310,
        badge: "Ultra Thin",
        badgeColor: "bg-warning text-dark",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=700&q=80",
        description: "The thinnest Apple product ever made. Revolutionary Ultra Retina XDR Tandem OLED display and extreme M4 processing speeds.",
        specs: ["Apple M4 Next-gen silicon", "Ultra Retina XDR Tandem OLED", "5.1mm razor-thin profile", "Pencil Pro haptic feedback", "Thunderbolt / USB 4 port"],
        inStock: true
      },
      {
        id: 12,
        name: "Garmin Fenix 7X Sapphire Solar",
        category: "wearables",
        categoryLabel: "Wearables",
        price: 799,
        oldPrice: 899,
        discount: "11% OFF",
        rating: 4.8,
        reviewsCount: 165,
        badge: "Solar Powered",
        badgeColor: "bg-dark text-white",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=80",
        description: "Solar charging lens harnesses sunlight to extend battery life up to 37 days in smartwatch mode. Built-in LED flashlight and TopoActive maps.",
        specs: ["Power Sapphire Solar lens", "Up to 37 days battery", "Built-in multi-LED flashlight", "Preloaded TopoActive maps", "Pulse Ox & HRV status"],
        inStock: true
      }
    ];

    this._categories = [
      { id: "all", name: "All Products", icon: "bi-grid-fill" },
      { id: "laptops", name: "Laptops & Tablets", icon: "bi-laptop" },
      { id: "smartphones", name: "Smartphones", icon: "bi-phone" },
      { id: "audio", name: "Audio & ANC", icon: "bi-headphones" },
      { id: "wearables", name: "Wearables", icon: "bi-smartwatch" },
      { id: "cameras", name: "Cameras", icon: "bi-camera" },
      { id: "peripherals", name: "Peripherals", icon: "bi-keyboard" }
    ];
  }

  /**
   * Returns all available products.
   * @returns {Array}
   */
  getAllProducts() {
    return [...this._products];
  }

  /**
   * Retrieves a single product by numeric ID.
   * @param {number|string} id
   * @returns {Object|null}
   */
  getProductById(id) {
    const numId = parseInt(id, 10);
    return this._products.find(p => p.id === numId) || null;
  }

  /**
   * Returns category taxonomy list.
   * @returns {Array}
   */
  getCategories() {
    return [...this._categories];
  }

  /**
   * Filters and sorts products based on user criteria.
   * @param {Object} options
   * @param {string} options.category - 'all' or category id
   * @param {string} options.searchQuery - keyword to search
   * @param {string} options.sortBy - 'featured', 'price-low', 'price-high', 'rating', 'discount'
   * @returns {Array}
   */
  filterProducts({ category = 'all', searchQuery = '', sortBy = 'featured' } = {}) {
    let result = this._products.filter(p => {
      const matchCategory = category === 'all' || p.category === category;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });

    // Sort operations
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => parseInt(b.discount, 10) - parseInt(a.discount, 10));
    }

    return result;
  }

  /**
   * Computes dollar savings between old and new price.
   */
  calculateSavings(oldPrice, newPrice) {
    return Math.max(0, oldPrice - newPrice);
  }
}

// Universal export
const productService = new ProductService();

if (typeof window !== 'undefined') {
  window.ProductService = ProductService;
  window.productService = productService;
  window.PRODUCTS = productService.getAllProducts();
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProductService, productService };
}
