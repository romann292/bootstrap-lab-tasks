/**
 * Backend ProductController
 * Handles HTTP requests and responses for the Products domain.
 */
import { ProductService } from "../services/product.service.js";

export class ProductController {
  static getAll(req, res, queryParams) {
    const products = ProductService.getAll(queryParams);
    return {
      status: 200,
      body: { success: true, count: products.length, data: products }
    };
  }

  static getById(req, res, id) {
    const product = ProductService.getById(id);
    if (!product) {
      return {
        status: 404,
        body: { success: false, message: `Product with ID ${id} not found` }
      };
    }
    return {
      status: 200,
      body: { success: true, data: product }
    };
  }
}

