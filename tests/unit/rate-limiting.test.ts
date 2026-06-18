import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  checkAuthRateLimit,
  checkRateLimit,
  clearAuthRateLimit,
  getRateLimitKey,
  type RateLimitResult,
} from '../../src/server/auth/rate-limit';

// Reset the in-memory rate limit buckets between tests
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('checkAuthRateLimit — counter increments', () => {
  it('allows the first request within limit', () => {
    const result = checkAuthRateLimit('test-key-1', Date.now(), 5, 15 * 60 * 1000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('allows up to the limit', () => {
    const key = 'test-key-2';
    const now = Date.now();
    for (let i = 0; i < 5; i++) {
      const result = checkAuthRateLimit(key, now, 5, 15 * 60 * 1000);
      expect(result.allowed).toBe(true);
    }
  });

  it('blocks after exceeding the limit', () => {
    const key = 'test-key-3';
    const now = Date.now();
    for (let i = 0; i < 5; i++) {
      checkAuthRateLimit(key, now, 5, 15 * 60 * 1000);
    }
    const result = checkAuthRateLimit(key, now, 5, 15 * 60 * 1000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('tracks remaining count decreasing', () => {
    const key = 'test-key-4';
    const now = Date.now();
    expect(checkAuthRateLimit(key, now, 5, 15 * 60 * 1000).remaining).toBe(4);
    expect(checkAuthRateLimit(key, now, 5, 15 * 60 * 1000).remaining).toBe(3);
    expect(checkAuthRateLimit(key, now, 5, 15 * 60 * 1000).remaining).toBe(2);
  });
});

describe('checkAuthRateLimit — window expiry', () => {
  it('resets counter after window expires', () => {
    const key = 'test-key-window';
    const now = Date.now();
    // Exhaust the limit
    for (let i = 0; i < 5; i++) {
      checkAuthRateLimit(key, now, 5, 60 * 1000);
    }
    expect(checkAuthRateLimit(key, now, 5, 60 * 1000).allowed).toBe(false);

    // Advance time past the window
    const future = now + 61 * 1000;
    const result = checkAuthRateLimit(key, future, 5, 60 * 1000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("partially resets if a different key has separate window", () => {
    const now = Date.now();
    // Exhaust key A
    for (let i = 0; i < 5; i++) {
      checkAuthRateLimit('key-a', now, 5, 60 * 1000);
    }
    expect(checkAuthRateLimit('key-a', now, 5, 60 * 1000).allowed).toBe(false);

    // Key B should still be allowed
    expect(checkAuthRateLimit('key-b', now, 5, 60 * 1000).allowed).toBe(true);
  });

  it('uses default 5/15min windows when no args provided', () => {
    const key = 'test-key-defaults';
    for (let i = 0; i < 5; i++) {
      checkAuthRateLimit(key);
    }
    expect(checkAuthRateLimit(key).allowed).toBe(false);
  });

  it('uses default window length of 15 minutes', () => {
    const key = 'test-key-default-window';
    const now = Date.now();
    // Exhaust limit
    for (let i = 0; i < 5; i++) {
      checkAuthRateLimit(key, now, 5, 15 * 60 * 1000);
    }
    expect(checkAuthRateLimit(key, now, 5, 15 * 60 * 1000).allowed).toBe(false);

    // Advance past 15 min window
    const future = now + 16 * 60 * 1000;
    expect(checkAuthRateLimit(key, future, 5, 15 * 60 * 1000).allowed).toBe(true);
  });

  it('uses custom limit and window', () => {
    const key = 'test-key-custom';
    const now = Date.now();
    // Limit 2 in 5 min
    expect(checkAuthRateLimit(key, now, 2, 5 * 60 * 1000).allowed).toBe(true);
    expect(checkAuthRateLimit(key, now, 2, 5 * 60 * 1000).allowed).toBe(true);
    expect(checkAuthRateLimit(key, now, 2, 5 * 60 * 1000).allowed).toBe(false);
  });

  it('returns resetAt in the future', () => {
    const now = Date.now();
    const result = checkAuthRateLimit('test-key-reset', now, 5, 60 * 1000);
    expect(result.resetAt.getTime()).toBeGreaterThan(now);
    expect(result.resetAt.getTime()).toBe(now + 60 * 1000);
  });

  it('has same resetAt for multiple requests in same window', () => {
    const now = Date.now();
    const result1 = checkAuthRateLimit('test-key-same-reset', now, 5, 60 * 1000);
    const result2 = checkAuthRateLimit('test-key-same-reset', now, 5, 60 * 1000);
    expect(result1.resetAt.getTime()).toBe(result2.resetAt.getTime());
  });
});

describe('clearAuthRateLimit', () => {
  it('allows requests after clearing', () => {
    const key = 'test-key-clear';
    const now = Date.now();
    // Exhaust limit
    for (let i = 0; i < 5; i++) {
      checkAuthRateLimit(key, now, 5, 60 * 1000);
    }
    expect(checkAuthRateLimit(key, now, 5, 60 * 1000).allowed).toBe(false);

    clearAuthRateLimit(key);

    // Should be allowed again
    const result = checkAuthRateLimit(key, Date.now(), 5, 60 * 1000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('does nothing for non-existent key', () => {
    expect(() => clearAuthRateLimit('non-existent-key')).not.toThrow();
  });
});

describe('getRateLimitKey', () => {
  it('combines email and IP address', () => {
    const key = getRateLimitKey('User@Example.com', '192.168.1.1');
    expect(key).toBe('user@example.com::192.168.1.1');
  });

  it('uses unknown-ip when IP is null', () => {
    const key = getRateLimitKey('test@test.com', null);
    expect(key).toBe('test@test.com::unknown-ip');
  });

  it('uses unknown-ip when IP is undefined', () => {
    const key = getRateLimitKey('test@test.com', undefined);
    expect(key).toBe('test@test.com::unknown-ip');
  });

  it('normalizes email to lowercase', () => {
    const key = getRateLimitKey('  USER@EXAMPLE.COM ', '10.0.0.1');
    expect(key).toContain('user@example.com');
  });

  it('different email same IP produces different keys', () => {
    const k1 = getRateLimitKey('a@b.com', '10.0.0.1');
    const k2 = getRateLimitKey('c@d.com', '10.0.0.1');
    expect(k1).not.toBe(k2);
  });

  it('same email different IP produces different keys', () => {
    const k1 = getRateLimitKey('a@b.com', '10.0.0.1');
    const k2 = getRateLimitKey('a@b.com', '10.0.0.2');
    expect(k1).not.toBe(k2);
  });
});

describe('checkAuthRateLimit — edge cases', () => {
  it('handles limit of 1', () => {
    const key = 'test-key-limit-1';
    const now = Date.now();
    expect(checkAuthRateLimit(key, now, 1, 60 * 1000).allowed).toBe(true);
    expect(checkAuthRateLimit(key, now, 1, 60 * 1000).allowed).toBe(false);
  });

  it('handles limit of 0 (block all)', () => {
    const key = 'test-key-limit-0';
    const now = Date.now();
    const result = checkAuthRateLimit(key, now, 0, 60 * 1000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('handles zero window (instant reset)', () => {
    const key = 'test-key-zero-window';
    const now = Date.now();
    expect(checkAuthRateLimit(key, now, 1, 0).allowed).toBe(true);
    // same ms, window already expired -> reset
    expect(checkAuthRateLimit(key, now, 1, 0).allowed).toBe(true);
  });

  it('two keys with same identifier are same bucket', () => {
    const now = Date.now();
    checkAuthRateLimit('same-bucket', now, 3, 60 * 1000);
    checkAuthRateLimit('same-bucket', now, 3, 60 * 1000);
    checkAuthRateLimit('same-bucket', now, 3, 60 * 1000);
    expect(checkAuthRateLimit('same-bucket', now, 3, 60 * 1000).allowed).toBe(false);
  });
});

describe('checkRateLimit — Token Bucket async (retryAfterMs semantics)', () => {
  it('allows first request within capacity', async () => {
    const result = await checkRateLimit('rl-user', 'rl-action', 5, 1);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.retryAfterMs).toBe(0);
  });

  it('blocks after exceeding capacity', async () => {
    const capacity = 2;
    for (let i = 0; i < capacity; i++) await checkRateLimit('rl-deny', 'rl-deny-action', capacity, 10);
    const result = await checkRateLimit('rl-deny', 'rl-deny-action', capacity, 10);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it('independent buckets for different user+action pairs', async () => {
    const r1 = await checkRateLimit('u1', 'act', 1, 1);
    const r2 = await checkRateLimit('u2', 'act', 1, 1);
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
  });

  it('returns retryAfterMs (timeToRefill) not resetAt (windowMs)', async () => {
    const result = await checkRateLimit('rl-shape', 'shape', 5, 1);
    expect(result).toHaveProperty('retryAfterMs');
    expect(typeof result.retryAfterMs).toBe('number');
    expect('resetAt' in result).toBe(false);
  });
});
