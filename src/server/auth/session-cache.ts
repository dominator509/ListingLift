// ---------------------------------------------------------------------------
// In-memory session cache (Q18 P2 — reduces DB queries for repeat requests)
// ---------------------------------------------------------------------------
// B-01 from Q10: every mutation hits 3 DB queries (session + membership + idempotency).
// This cache eliminates the session lookup for requests within the TTL window.

export interface SessionCacheEntry<V> {
  value: V;
  expiresAt: number; // epoch ms
}

const CACHE_TTL_MS = 30_000; // 30 seconds
const MAX_CACHE_SIZE = 10_000; // prevent unbounded growth (LRU eviction)
const CLEANUP_INTERVAL_MS = 60_000; // 1 minute

class SessionCache<V> {
  private map = new Map<string, SessionCacheEntry<V>>();
  private accessOrder: string[] = []; // LRU tracking

  get(key: string): V | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;

    if (Date.now() >= entry.expiresAt) {
      this.map.delete(key);
      this.removeFromAccessOrder(key);
      return undefined;
    }

    // Move to end (most recently used)
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
    return entry.value;
  }

  set(key: string, value: V): void {
    // Evict oldest if at capacity
    if (this.map.size >= MAX_CACHE_SIZE && !this.map.has(key)) {
      const oldest = this.accessOrder.shift();
      if (oldest) this.map.delete(oldest);
    }

    this.map.set(key, {
      value,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  delete(key: string): void {
    this.map.delete(key);
    this.removeFromAccessOrder(key);
  }

  clear(): void {
    this.map.clear();
    this.accessOrder = [];
  }

  get size(): number {
    return this.map.size;
  }

  /** Remove all expired entries. Called by periodic timer. */
  cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.map) {
      if (now >= entry.expiresAt) {
        this.map.delete(key);
        this.removeFromAccessOrder(key);
      }
    }
  }

  private removeFromAccessOrder(key: string): void {
    const idx = this.accessOrder.indexOf(key);
    if (idx !== -1) this.accessOrder.splice(idx, 1);
  }
}

// Singleton session cache
export const sessionCache = new SessionCache<{
  userId: string;
  organizationId: string;
  role: string;
  tokenHash: string;
}>();

// Periodic cleanup of expired entries
setInterval(() => {
  sessionCache.cleanupExpired();
}, CLEANUP_INTERVAL_MS).unref();
