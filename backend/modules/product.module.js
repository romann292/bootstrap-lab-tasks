/**
 * Backend ProductModule
 * Groups routing, controllers, and services for the Product domain.
 */
import { ProductController } from "../controllers/product.controller.js";

export class ProductModule {
  static handleRoute(pathname, method, queryParams) {
    if (pathname === "/api/products" && method === "GET") {
      return ProductController.getAll(null, null, queryParams);
    }
    const match = pathname.match(/^\/api\/products\/(\d+)$/);
    if (match && method === "GET") {
      return ProductController.getById(null, null, match[1]);
    }
    return null;
  }
}

