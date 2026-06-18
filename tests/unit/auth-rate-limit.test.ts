import { describe, expect, it, beforeEach } from 'vitest';
import {
  checkAuthRateLimit,
  checkRateLimit,
  clearAuthRateLimit,
  getRateLimitKey,
  type RateLimitResult,
} from '../../src/server/auth/rate-limit';

describe('getRateLimitKey — composite key formation', () => {
  it('combines lowercase email and ip', () => {
    expect(getRateLimitKey('User@Example.COM', '192.168.1.1')).toBe('user@example.com::192.168.1.1');
  });

  it('handles null ip with fallback', () => {
    expect(getRateLimitKey('a@b.com', null)).toBe('a@b.com::unknown-ip');
  });

  it('handles undefined ip with fallback', () => {
    expect(getRateLimitKey('a@b.com', undefined)).toBe('a@b.com::unknown-ip');
  });

  it('lowercases email and trims leading/trailing whitespace', () => {
    expect(getRateLimitKey('  USER@TEST.COM ', '10.0.0.1')).toBe('user@test.com::10.0.0.1');
  });

  it('handles IPv6 loopback address', () => {
    expect(getRateLimitKey('User+tag@Example.com', '::1')).toBe('user+tag@example.com::::1');
  });
});

describe('checkAuthRateLimit — default params (5 req / 15min)', () => {
  const FIXED_NOW = 1_000_000_000_000;

  beforeEach(() => {
    clearAuthRateLimit('test-key');
    clearAuthRateLimit('test-key-2');
  });

  it('allows first request', () => {
    const result = checkAuthRateLimit('test-key', FIXED_NOW);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.resetAt.getTime()).toBe(FIXED_NOW + 15 * 60 * 1000);
  });

  it('allows up to limit requests', () => {
    const limit = 5;
    for (let i = 1; i <= limit; i++) {
      const result = checkAuthRateLimit('test-key', FIXED_NOW);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(limit - i);
    }
  });

  it('blocks request at limit+1', () => {
    const key = 'test-key-2';
    for (let i = 0; i < 5; i++) checkAuthRateLimit(key, FIXED_NOW);
    const result = checkAuthRateLimit(key, FIXED_NOW);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('returns remaining of 0 when over limit', () => {
    const key = 'overflow-key';
    for (let i = 0; i < 7; i++) checkAuthRateLimit(key, FIXED_NOW);
    const result = checkAuthRateLimit(key, FIXED_NOW);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('resets after window expires', () => {
    const key = 'reset-key';
    for (let i = 0; i < 5; i++) checkAuthRateLimit(key, FIXED_NOW);
    // Window is [FIXED_NOW, FIXED_NOW + 15min), so FIXED_NOW + 15min triggers reset
    const result = checkAuthRateLimit(key, FIXED_NOW + 15 * 60 * 1000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('resets exactly at window boundary (resetAt <= now)', () => {
    const key = 'boundary-key';
    for (let i = 0; i < 5; i++) checkAuthRateLimit(key, FIXED_NOW);
    const result = checkAuthRateLimit(key, FIXED_NOW + 15 * 60 * 1000 + 1);
    expect(result.allowed).toBe(true);
  });

  it('uses independent buckets for different keys', () => {
    const resultA = checkAuthRateLimit('key-a', FIXED_NOW);
    const resultB = checkAuthRateLimit('key-b', FIXED_NOW);
    expect(resultA.allowed).toBe(true);
    expect(resultB.allowed).toBe(true);
    expect(resultA.remaining).toBe(4);
    expect(resultB.remaining).toBe(4);
  });
});

describe('checkAuthRateLimit — custom limit and window', () => {
  const FIXED_NOW = 2_000_000_000_000;

  beforeEach(() => {
    clearAuthRateLimit('custom-key');
  });

  it('enforces custom limit', () => {
    checkAuthRateLimit('custom-key', FIXED_NOW, 2);
    expect(checkAuthRateLimit('custom-key', FIXED_NOW, 2).allowed).toBe(true);
    expect(checkAuthRateLimit('custom-key', FIXED_NOW, 2).allowed).toBe(false);
  });

  it('honors custom window duration', () => {
    const key = 'window-key';
    const windowMs = 60_000; // 1 minute
    checkAuthRateLimit(key, FIXED_NOW, 3, windowMs);
    checkAuthRateLimit(key, FIXED_NOW, 3, windowMs);
    checkAuthRateLimit(key, FIXED_NOW, 3, windowMs);
    const blocked = checkAuthRateLimit(key, FIXED_NOW, 3, windowMs);
    expect(blocked.allowed).toBe(false);
    // After window expires, resets
    const after = checkAuthRateLimit(key, FIXED_NOW + 60_001, 3, windowMs);
    expect(after.allowed).toBe(true);
  });
});

describe('clearAuthRateLimit — bucket cleanup', () => {
  it('removes bucket entirely', () => {
    const key = 'clear-key';
    checkAuthRateLimit(key, 1000);
    clearAuthRateLimit(key);
    const result = checkAuthRateLimit(key, 1000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('is safe to call on non-existent key', () => {
    expect(() => clearAuthRateLimit('non-existent')).not.toThrow();
  });
});

describe('checkAuthRateLimit — edge cases', () => {
  it('handles now=0 (epoch)', () => {
    const result = checkAuthRateLimit('epoch-key', 0);
    expect(result.allowed).toBe(true);
    expect(result.resetAt.getTime()).toBe(15 * 60 * 1000);
  });

  it('handles negative now values', () => {
    const result = checkAuthRateLimit('negative-key', -1000);
    expect(result.allowed).toBe(true);
  });

  it('handles limit of 1', () => {
    const key = 'single-hit-key';
    expect(checkAuthRateLimit(key, 5000, 1).allowed).toBe(true);
    expect(checkAuthRateLimit(key, 5000, 1).allowed).toBe(false);
  });

  it('handles large limit values', () => {
    const key = 'large-limit-key';
    for (let i = 0; i < 100; i++) {
      checkAuthRateLimit(key, 10000, 100);
    }
    expect(checkAuthRateLimit(key, 10000, 100).allowed).toBe(false);
  });

  it('handles very long window durations', () => {
    const key = 'long-window-key';
    const longWindow = 365 * 24 * 60 * 60 * 1000; // 1 year
    const result = checkAuthRateLimit(key, 20000, 5, longWindow);
    expect(result.allowed).toBe(true);
    expect(result.resetAt.getTime()).toBe(20000 + longWindow);
  });

  it('resetAt is a valid Date object', () => {
    const result = checkAuthRateLimit('date-check-key', 99999);
    expect(result.resetAt).toBeInstanceOf(Date);
  });
});

describe('checkRateLimit — Token Bucket async (retryAfterMs semantics)', () => {
  it('allows first request', async () => {
    const result = await checkRateLimit('tb-user', 'test-action', 5, 1);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.retryAfterMs).toBe(0);
  });

  it('allows up to capacity requests', async () => {
    const capacity = 3;
    for (let i = 1; i <= capacity; i++) {
      const result = await checkRateLimit('tb-burst', 'burst-action', capacity, 10);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(capacity - i);
    }
  });

  it('blocks after exceeding capacity', async () => {
    const capacity = 2;
    for (let i = 0; i < capacity; i++) await checkRateLimit('tb-deny', 'deny-action', capacity, 10);
    const result = await checkRateLimit('tb-deny', 'deny-action', capacity, 10);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    // retryAfterMs should be > 0 for a denied Token Bucket (timeToRefill semantics)
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it('returns positive retryAfterMs when denied', async () => {
    const capacity = 1;
    await checkRateLimit('tb-retry', 'retry-action', capacity, 0.1);
    const result = await checkRateLimit('tb-retry', 'retry-action', capacity, 0.1);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it('uses different buckets for different user+action pairs', async () => {
    const r1 = await checkRateLimit('user-a', 'login', 1, 1);
    const r2 = await checkRateLimit('user-b', 'login', 1, 1);
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
  });

  it('returns RateLimitResult shape (retryAfterMs not resetAt)', async () => {
    const result = await checkRateLimit('tb-shape', 'shape-test', 5, 1);
    expect(result).toHaveProperty('allowed');
    expect(result).toHaveProperty('remaining');
    expect(result).toHaveProperty('retryAfterMs');
    expect(typeof result.allowed).toBe('boolean');
    expect(typeof result.remaining).toBe('number');
    expect(typeof result.retryAfterMs).toBe('number');
    // Confirm Token Bucket returns retryAfterMs (timeToRefill), not resetAt (windowMs)
    expect('resetAt' in result).toBe(false);
  });
});
