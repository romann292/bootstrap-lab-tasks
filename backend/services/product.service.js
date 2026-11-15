/**
 * Backend ProductService
 * Encapsulates products data access and querying.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "..", "data", "products.json");

export class ProductService {
  static getAll({ category = 'all', search = '', sortBy = 'featured' } = {}) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      let result = data.filter(p => {
        const matchCat = category === 'all' || p.category === category;
        const q = search.trim().toLowerCase();
        const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
        return matchCat && matchSearch;
      });

      if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
      else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
      else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

      return result;
    } catch (err) {
      console.error("[Backend ProductService] Error reading products:", err);
      return [];
    }
  }

  static getById(id) {
    const list = this.getAll();
    return list.find(p => p.id === parseInt(id, 10)) || null;
  }
}

