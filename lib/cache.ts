/**
 * Simple in-memory cache for site architecture analysis results
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Get cached value if it exists and is still valid
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }
    return entry.data as T;
  }

  /**
   * Set a value in the cache
   */
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear a specific cache entry or all entries
   */
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache entry timestamp
   */
  getTimestamp(key: string): number | null {
    const entry = this.cache.get(key);
    return entry?.timestamp ?? null;
  }

  /**
   * Check if a key exists in cache
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }
}

// Export singleton instance
export const siteStructureCache = new SimpleCache();

