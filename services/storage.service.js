/**
 * ============================================================================
 * StorageService
 * ============================================================================
 * Handles all browser persistence operations (localStorage) with defensive
 * error handling, automated JSON serialization/deserialization, and an
 * in-memory fallback cache when localStorage is unavailable.
 *
 * Part of: E-Commerce Store (NovaStore)
 * Student: Roman Fatima (241878) - BSCS 5A - Air University
 * ============================================================================
 */

class StorageService {
  constructor() {
    this._memoryFallback = new Map();
    this._isLocalStorageAvailable = this._checkStorageAvailability();
  }

  _checkStorageAvailability() {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('[StorageService] localStorage is not available. Using in-memory fallback.');
      return false;
    }
  }

  /**
   * Retrieves an item from storage, parsed as JSON.
   * @param {string} key
   * @param {*} defaultValue
   * @returns {*}
   */
  getItem(key, defaultValue = null) {
    try {
      if (this._isLocalStorageAvailable) {
        const item = window.localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : defaultValue;
      }
      return this._memoryFallback.has(key) ? this._memoryFallback.get(key) : defaultValue;
    } catch (err) {
      console.error(`[StorageService] Error reading key "${key}":`, err);
      return defaultValue;
    }
  }

  /**
   * Saves an item to storage, serialized to JSON.
   * @param {string} key
   * @param {*} value
   * @returns {boolean} Success status
   */
  setItem(key, value) {
    try {
      if (this._isLocalStorageAvailable) {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      }
      this._memoryFallback.set(key, value);
      return true;
    } catch (err) {
      console.error(`[StorageService] Error saving key "${key}":`, err);
      // Fallback to memory on quota exceeded
      this._memoryFallback.set(key, value);
      return false;
    }
  }

  /**
   * Removes an item from storage.
   * @param {string} key
   */
  removeItem(key) {
    try {
      if (this._isLocalStorageAvailable) {
        window.localStorage.removeItem(key);
      }
      this._memoryFallback.delete(key);
      return true;
    } catch (err) {
      console.error(`[StorageService] Error removing key "${key}":`, err);
      return false;
    }
  }

  /**
   * Clears all storage keys managed by the application.
   */
  clearAll() {
    try {
      if (this._isLocalStorageAvailable) {
        window.localStorage.clear();
      }
      this._memoryFallback.clear();
      return true;
    } catch (err) {
      console.error('[StorageService] Error clearing storage:', err);
      return false;
    }
  }
}

// Universal export
const storageService = new StorageService();

if (typeof window !== 'undefined') {
  window.StorageService = StorageService;
  window.storageService = storageService;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageService, storageService };
}
