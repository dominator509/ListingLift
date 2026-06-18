/// <reference types="node" />
/**
 * In-memory sliding-window rate limiter with LRU eviction.
 * Not for multi-process deployments — single-instance only.
 */
import { NextResponse, type NextRequest } from 'next/server';

interface Bucket {
  tokens: number;
  resetAt: number;
  lastAccess: number; // monotonic counter for LRU eviction order
}

const WINDOW_MS = 60_000; // 1 minute
const MAX_TOKENS = 60; // 60 requests per minute per key
const CLEANUP_INTERVAL_MS = 120_000;
const MAX_ENTRIES = 10_000;

const store = new Map<string, Bucket>();

let lastCleanup = Date.now();
let accessCounter = 0; // monotonic clock for LRU ordering

function cleanupStale(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  // First pass: delete fully expired entries (time-based)
  if (store.size > MAX_ENTRIES) {
    const threshold = now;
    for (const [key, bucket] of store) {
      if (bucket.resetAt < threshold) store.delete(key);
    }
  }

  // Second pass: if still over capacity, evict least recently accessed
  if (store.size > MAX_ENTRIES) {
    const sorted = [...store.entries()].sort((a, b) => a[1].lastAccess - b[1].lastAccess);
    const toEvict = sorted.slice(0, store.size - MAX_ENTRIES);
    for (const [key] of toEvict) {
      store.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterMs: number;
}

export function checkRateLimit(key: string, windowMs = WINDOW_MS, maxTokens = MAX_TOKENS): RateLimitResult {
  cleanupStale();
  const now = Date.now();
  let bucket = store.get(key);

  if (!bucket || bucket.resetAt <= now) {
    bucket = { tokens: maxTokens - 1, resetAt: now + windowMs, lastAccess: ++accessCounter };
    store.set(key, bucket);
    return { allowed: true, remaining: bucket.tokens, resetAt: bucket.resetAt, retryAfterMs: 0 };
  }

  if (bucket.tokens > 0) {
    bucket.tokens--;
    bucket.lastAccess = ++accessCounter;
    return { allowed: true, remaining: bucket.tokens, resetAt: bucket.resetAt, retryAfterMs: 0 };
  }

  bucket.lastAccess = ++accessCounter;
  return { allowed: false, remaining: 0, resetAt: bucket.resetAt, retryAfterMs: bucket.resetAt - now };
}

export function rateLimiterMiddleware(key: string, windowMs?: number, maxTokens?: number): NextResponse | null {
  const result = checkRateLimit(key, windowMs, maxTokens);
  if (result.allowed) return null;

  return NextResponse.json(
    { ok: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please slow down.' } },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil(result.retryAfterMs / 1000)),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
      },
    }
  );
}

export function getLimiterStats(): { size: number; maxEntries: number } {
  return { size: store.size, maxEntries: MAX_ENTRIES };
}

/** Reset all rate limit buckets — for testing only */
export function resetRateLimiter(): void {
  store.clear();
}
