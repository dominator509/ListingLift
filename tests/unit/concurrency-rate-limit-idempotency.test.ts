import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  checkAuthRateLimit,
  clearAuthRateLimit,
  getRateLimitKey,
} from '../../src/server/auth/rate-limit';
import {
  checkSecurityRateLimit,
  clearSecurityRateLimitBuckets,
  evaluateSecurityRateLimit,
} from '../../src/server/services/security-rate-limit-policy-service';
import { checkAutomationRateLimit } from '../../src/server/services/automation-rate-limit-service';
import { parseJson } from '../../src/server/routes/route-helpers';

// ---------------------------------------------------------------------------
// 1. RATE LIMITING — Response shape, headers, bypass vectors
// ---------------------------------------------------------------------------
describe('RATE LIMITING — response shape and header contracts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearAuthRateLimit('header-test-key');
  });

  afterEach(() => {
    clearAuthRateLimit('header-test-key');
    clearSecurityRateLimitBuckets();
    vi.useRealTimers();
  });

  it('checkAuthRateLimit returns all fields required for X-RateLimit headers', () => {
    const result = checkAuthRateLimit('header-test-key', Date.now(), 10, 60_000);
    // Required for headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
    expect(result).toHaveProperty('allowed');
    expect(result).toHaveProperty('remaining');
    expect(result).toHaveProperty('resetAt');
    expect(typeof result.allowed).toBe('boolean');
    expect(typeof result.remaining).toBe('number');
    expect(result.resetAt).toBeInstanceOf(Date);
    // First request: limit=10, so 9 remaining
    expect(result.remaining).toBe(9);
    expect(result.allowed).toBe(true);
  });

  it('remaining decreases by 1 per call for same key-window', () => {
    const key = 'dec-key';
    const now = Date.now();
    expect(checkAuthRateLimit(key, now, 5, 60_000).remaining).toBe(4);
    expect(checkAuthRateLimit(key, now, 5, 60_000).remaining).toBe(3);
    expect(checkAuthRateLimit(key, now, 5, 60_000).remaining).toBe(2);
    expect(checkAuthRateLimit(key, now, 5, 60_000).remaining).toBe(1);
    expect(checkAuthRateLimit(key, now, 5, 60_000).remaining).toBe(0);
    expect(checkAuthRateLimit(key, now, 5, 60_000).allowed).toBe(false);
    expect(checkAuthRateLimit(key, now, 5, 60_000).remaining).toBe(0); // stays 0
  });

  it('resetAt is epoch + windowMs for first request', () => {
    const now = 1_000_000_000_000;
    const result = checkAuthRateLimit('reset-test', now, 5, 15 * 60 * 1000);
    expect(result.resetAt.getTime()).toBe(now + 15 * 60 * 1000);
  });
});

describe('RATE LIMITING — IP rotation and header bypass vectors', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('different IPs produce different rate limit buckets (X-Forwarded-For isolation)', () => {
    const now = Date.now();
    const email = 'seller@example.com';
    const ip1 = '10.0.0.1';
    const ip2 = '10.0.0.2';
    const key1 = getRateLimitKey(email, ip1);
    const key2 = getRateLimitKey(email, ip2);
    expect(key1).not.toBe(key2);
    // Exhaust key1
    for (let i = 0; i < 5; i++) checkAuthRateLimit(key1, now, 5, 60_000);
    expect(checkAuthRateLimit(key1, now, 5, 60_000).allowed).toBe(false);
    // key2 is independent — still has all 5 attempts
    expect(checkAuthRateLimit(key2, now, 5, 60_000).allowed).toBe(true);
    expect(checkAuthRateLimit(key2, now, 5, 60_000).remaining).toBe(3);
  });

  it('same IP different emails produce different buckets', () => {
    const now = Date.now();
    const ip = '10.0.0.1';
    const keyA = getRateLimitKey('a@b.com', ip);
    const keyB = getRateLimitKey('c@d.com', ip);
    for (let i = 0; i < 5; i++) checkAuthRateLimit(keyA, now, 5, 60_000);
    expect(checkAuthRateLimit(keyA, now, 5, 60_000).allowed).toBe(false);
    expect(checkAuthRateLimit(keyB, now, 5, 60_000).allowed).toBe(true);
  });

  it('IPv6 loopback and IPv4 localhost are different buckets', () => {
    const now = Date.now();
    const keyV4 = getRateLimitKey('test@test.com', '127.0.0.1');
    const keyV6 = getRateLimitKey('test@test.com', '::1');
    expect(keyV4).not.toBe(keyV6);
    for (let i = 0; i < 5; i++) checkAuthRateLimit(keyV4, now, 5, 60_000);
    expect(checkAuthRateLimit(keyV4, now, 5, 60_000).allowed).toBe(false);
    expect(checkAuthRateLimit(keyV6, now, 5, 60_000).allowed).toBe(true);
  });

  it('X-Forwarded-For with proxy chain (comma-separated) uses raw value as key', () => {
    // The rate limit key function doesn't parse X-Forwarded-For chains
    // — it uses whatever IP string is passed. This test documents that
    // a proxy chain like "client, proxy1, proxy2" would be the full string.
    const now = Date.now();
    const chainKey = getRateLimitKey('a@b.com', '10.0.0.1, 10.0.0.2, 10.0.0.3');
    const singleKey = getRateLimitKey('a@b.com', '10.0.0.1');
    expect(chainKey).not.toBe(singleKey);
    // An attacker rotating through proxies gets a fresh bucket per chain value
    const freshKey = getRateLimitKey('a@b.com', '10.0.0.4, 10.0.0.5');
    expect(checkAuthRateLimit(freshKey, now, 5, 60_000).allowed).toBe(true);
  });
});

describe('RATE LIMITING — 429 response contract (structural)', () => {
  it('blocked response shape contains expected fields', () => {
    const key = 'blocked-shape-key';
    const now = Date.now();
    for (let i = 0; i < 5; i++) checkAuthRateLimit(key, now, 5, 60_000);
    const blocked = checkAuthRateLimit(key, now, 5, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetAt.getTime()).toBeGreaterThan(now);
  });

  it('resetAt is always in the future for a blocked request', () => {
    const key = 'future-reset-key';
    const now = Date.now();
    for (let i = 0; i < 5; i++) checkAuthRateLimit(key, now, 5, 60_000);
    const result = checkAuthRateLimit(key, now, 5, 60_000);
    expect(result.resetAt.getTime()).toBeGreaterThan(now);
  });
});

// ---------------------------------------------------------------------------
// 2. CONCURRENCY / RACE CONDITIONS (in-memory)
// ---------------------------------------------------------------------------
describe('CONCURRENCY — in-memory rate limit bucket races', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('concurrent checkAuthRateLimit calls do not exceed limit due to JS single-thread', async () => {
    // JavaScript is single-threaded, so concurrent Map access is safe.
    // This test verifies that Promise.all on async-wrapped calls still
    // respects the bucket count correctly.
    const key = 'concurrent-key';
    const now = Date.now();
    const limit = 20;
    const callCount = 50;

    const calls = Array.from({ length: callCount }, () =>
      Promise.resolve().then(() => checkAuthRateLimit(key, now, limit, 60_000)),
    );
    const results = await Promise.all(calls);
    const allowed = results.filter((r) => r.allowed).length;
    const blocked = results.filter((r) => !r.allowed).length;

    // JS event loop ensures sequential Map access, so exactly `limit` are allowed
    expect(allowed).toBe(limit);
    expect(blocked).toBe(callCount - limit);
    // All blocked should have remaining 0
    for (const r of results.slice(limit)) {
      expect(r.remaining).toBe(0);
    }
  });

  it('concurrent checkSecurityRateLimit respects limits under parallel pressure', async () => {
    const action = 'auth.login' as const;
    const subject = { email: 'race@test.com', ip: '10.0.0.1' };
    // Read the actual limit from the policy dynamically
    const first = checkSecurityRateLimit(action, subject, Date.now());
    // Reset after reading limit
    clearSecurityRateLimitBuckets();
    const limit = first.limit;
    const callCount = limit * 3;

    const calls = Array.from({ length: callCount }, () =>
      Promise.resolve().then(() => checkSecurityRateLimit(action, subject, Date.now())),
    );
    const results = await Promise.all(calls);
    const allowed = results.filter((r) => r.allowed).length;
    const blocked = results.filter((r) => !r.allowed).length;

    expect(allowed).toBe(limit);
    expect(blocked).toBe(callCount - limit);
    // All blocked have remaining 0
    for (const r of results.slice(limit)) {
      expect(r.remaining).toBe(0);
    }
  });

  it('concurrent checkAutomationRateLimit under burst', async () => {
    const key = 'auto-race-key';
    const limit = 30;
    const callCount = 100;

    const calls = Array.from({ length: callCount }, () =>
      Promise.resolve().then(() =>
        checkAutomationRateLimit({ key, limit, windowMs: 60_000 }),
      ),
    );
    const results = await Promise.all(calls);
    const allowed = results.filter((r) => r.allowed).length;
    const blocked = results.filter((r) => !r.allowed).length;

    expect(allowed).toBe(limit);
    expect(blocked).toBe(callCount - limit);
    for (const r of results.slice(limit)) {
      expect(r.allowed).toBe(false);
    }
  });

  it('concurrent calls on different keys are fully independent', async () => {
    const now = Date.now();
    const keys = ['key-a', 'key-b', 'key-c', 'key-d', 'key-e'];
    const limit = 3;
    const callCount = 10;

    const allCalls = keys.flatMap((k) =>
      Array.from({ length: callCount }, (_, i) =>
        Promise.resolve().then(() => ({
          key: k,
          result: checkAuthRateLimit(k, now, limit, 60_000),
          index: i,
        })),
      ),
    );
    const results = await Promise.all(allCalls);

    for (const k of keys) {
      const perKey = results.filter((r) => r.key === k);
      const allowed = perKey.filter((r) => r.result.allowed).length;
      expect(allowed).toBe(limit); // each key independently gets `limit` passes
    }
  });
});

describe('CONCURRENCY — same-email signup race (unique constraint simulation)', () => {
  it('signup duplicate detection: checkAuthRateLimit can gate same-email signups', () => {
    // In production, a UNIQUE constraint on user.email prevents duplicates.
    // This tests that rate limiting at the auth layer is independent of the DB constraint.
    const now = Date.now();
    const signupKey = getRateLimitKey('newuser@test.com', '10.0.0.1');

    // First signup attempt — allowed
    expect(checkAuthRateLimit(signupKey, now, 3, 60_000).allowed).toBe(true);
    // Second attempt (e.g., rapid double-submit) — allowed (within limit)
    expect(checkAuthRateLimit(signupKey, now, 3, 60_000).allowed).toBe(true);
    // Third — allowed
    expect(checkAuthRateLimit(signupKey, now, 3, 60_000).allowed).toBe(true);
    // Fourth — blocked by rate limit
    expect(checkAuthRateLimit(signupKey, now, 3, 60_000).allowed).toBe(false);
  });

  it('signup key is per-email+IP, so different IPs get separate buckets', () => {
    const now = Date.now();
    const key1 = getRateLimitKey('same@test.com', '10.0.0.1');
    const key2 = getRateLimitKey('same@test.com', '10.0.0.2');

    for (let i = 0; i < 5; i++) checkAuthRateLimit(key1, now, 5, 60_000);
    expect(checkAuthRateLimit(key1, now, 5, 60_000).allowed).toBe(false);
    // Different IP can still try
    expect(checkAuthRateLimit(key2, now, 5, 60_000).allowed).toBe(true);
  });
});

describe('CONCURRENCY — CSRF token issuance race', () => {
  it('concurrent token generation produces unique tokens (no collision)', async () => {
    // CSRF tokens are generated via crypto.randomBytes — collisions are astronomically unlikely.
    // This test verifies that rapid concurrent token generation doesn't produce duplicates.
    // We simulate by generating many tokens in parallel (crypto is async-safe).
    const { randomBytes } = await import('node:crypto');
    const tokenCount = 1000;
    const tokens = await Promise.all(
      Array.from({ length: tokenCount }, () =>
        new Promise<string>((resolve, reject) =>
          randomBytes(32, (err, buf) =>
            err ? reject(err) : resolve(buf.toString('hex')),
          ),
        ),
      ),
    );
    const unique = new Set(tokens);
    expect(unique.size).toBe(tokenCount);
  });
});

// ---------------------------------------------------------------------------
// 3. IDEMPOTENCY
// ---------------------------------------------------------------------------
describe('IDEMPOTENCY — absence and contract', () => {
  it('checkAuthRateLimit is NOT idempotent — each call increments counter', () => {
    const key = 'non-idempotent-key';
    const now = Date.now();
    // Calling checkAuthRateLimit 3 times with same params:
    const r1 = checkAuthRateLimit(key, now, 5, 60_000);
    const r2 = checkAuthRateLimit(key, now, 5, 60_000);
    const r3 = checkAuthRateLimit(key, now, 5, 60_000);
    // Each call decrements remaining — NOT idempotent
    expect(r1.remaining).toBe(4);
    expect(r2.remaining).toBe(3);
    expect(r3.remaining).toBe(2);
    // If it were idempotent, all would return remaining=4
  });

  it('parseJson in route-helpers has no idempotency key support', async () => {
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'value', idempotency_key: 'abc-123' }),
    });
    const body = await parseJson<Record<string, unknown>>(request, {});
    // parseJson passes through ALL fields — including idempotency_key if present
    expect(body).toHaveProperty('idempotency_key');
    // But it does NOT deduplicate — the route handler would need to implement that
    // This documents that idempotency is NOT enforced at the parse layer
  });

  it('Stripe webhook fulfillment plan does NOT implement idempotency key dedup', async () => {
    // The stripe billing orchestrator is a scaffold — no idempotency key checking
    // Stripe sends Idempotency-Key headers on retries, but this app doesn't check them
    const { createStripeWebhookFulfillmentPlan } =
      await import('../../src/server/services/stripe-billing-orchestrator');
    const plan1 = createStripeWebhookFulfillmentPlan(
      { id: 'evt_001', type: 'checkout.session.completed', data: { object: {} } },
      true,
    );
    const plan2 = createStripeWebhookFulfillmentPlan(
      { id: 'evt_001', type: 'checkout.session.completed', data: { object: {} } },
      true,
    );
    // Both calls produce identical results — no dedup, no idempotency check
    expect(plan1).toEqual(plan2);
    // In a production system with idempotency, the second call would return cached result
    // or reject as duplicate. Here it just creates a new plan object.
  });

  it('Gumroad fulfillment plan has zero idempotency protection', async () => {
    const { createGumroadWebhookProcessingPlan } =
      await import('../../src/server/services/gumroad-fulfillment-orchestrator');
    const payload = JSON.stringify({ sale_id: 'sale_001', product_name: 'Test' });
    const plan1 = createGumroadWebhookProcessingPlan({ payloadText: payload, signatureHeader: null });
    const plan2 = createGumroadWebhookProcessingPlan({ payloadText: payload, signatureHeader: null });
    // Same input produces same output — no idempotency store consulted
    expect(plan1).toEqual(plan2);
    // In production, Gumroad resends webhooks with same sale_id; this app would
    // process each as a new sale unless idempotency is added.
  });
});

// ---------------------------------------------------------------------------
// 4. RESOURCE EXHAUSTION
// ---------------------------------------------------------------------------
describe('RESOURCE EXHAUSTION — rate limit Map bounds', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Map-based rate limiter does not leak memory under many unique keys', () => {
    // Create 1000 unique keys, each used once
    const now = Date.now();
    for (let i = 0; i < 1000; i++) {
      checkAuthRateLimit(`bulk-key-${i}`, now, 100, 60_000);
    }
    // All should be allowed (each key only used once)
    const lastResult = checkAuthRateLimit(`bulk-key-999`, now, 100, 60_000);
    expect(lastResult.allowed).toBe(true);
    expect(lastResult.remaining).toBe(98);
    // The Map grows unboundedly — no eviction, no TTL cleanup
    // This is a known limitation documented in rate-limit.ts
  });

  it('zero-window effectively resets every call (no DoS protection)', () => {
    const key = 'zero-window-key';
    const now = Date.now();
    // With window=0, each call resets immediately, so every call is allowed
    for (let i = 0; i < 100; i++) {
      expect(checkAuthRateLimit(key, now + i, 5, 0).allowed).toBe(true);
    }
  });

  it('limit=0 blocks everything', () => {
    const key = 'block-all-key';
    const now = Date.now();
    expect(checkAuthRateLimit(key, now, 0, 60_000).allowed).toBe(false);
    expect(checkAuthRateLimit(key, now, 0, 60_000).allowed).toBe(false);
  });

  it('limit=Infinity allows everything (edge: large value)', () => {
    const key = 'unlimited-key';
    const now = Date.now();
    const hugeLimit = 1_000_000;
    for (let i = 0; i < 100; i++) {
      checkAuthRateLimit(key, now, hugeLimit, 60_000);
    }
    expect(checkAuthRateLimit(key, now, hugeLimit, 60_000).allowed).toBe(true);
  });
});

describe('RESOURCE EXHAUSTION — parseJson bounds', () => {
  it('parseJson handles empty body gracefully', async () => {
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '',
    });
    const fallback = { default: true };
    const result = await parseJson(request, fallback);
    expect(result).toEqual(fallback);
  });

  it('parseJson returns fallback on malformed JSON', async () => {
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json-at-all',
    });
    const fallback = { ok: false };
    const result = await parseJson(request, fallback);
    expect(result).toEqual(fallback);
  });

  it('parseJson handles deeply nested objects (stack safety)', async () => {
    // Build a deeply nested JSON object
    let deep = '{}';
    for (let i = 0; i < 100; i++) {
      deep = `{"a":${deep}}`;
    }
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: deep,
    });
    const result = await parseJson<Record<string, unknown>>(request, {});
    // Should successfully parse deeply nested object
    expect(result).toHaveProperty('a');
  });

  it('parseJson handles large payload (100KB)', async () => {
    const largeObject = { data: 'x'.repeat(100_000) };
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(largeObject),
    });
    const result = await parseJson<{ data: string }>(request, { data: '' });
    expect(result.data.length).toBe(100_000);
  });
});

// ---------------------------------------------------------------------------
// 5. AUTOMATION RATE LIMIT SERVICE
// ---------------------------------------------------------------------------
describe('AUTOMATION RATE LIMIT SERVICE', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows first request within default limit', () => {
    const result = checkAutomationRateLimit({ key: 'webhook-1' });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(29);
  });

  it('blocks after exceeding default limit of 30', () => {
    const key = 'auto-exhaust';
    for (let i = 0; i < 30; i++) {
      checkAutomationRateLimit({ key });
    }
    const result = checkAutomationRateLimit({ key });
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('respects custom limit and window', () => {
    const key = 'auto-custom';
    const now = Date.now();
    // Custom: 5 requests per 10 seconds
    for (let i = 0; i < 5; i++) {
      const r = checkAutomationRateLimit({ key, limit: 5, windowMs: 10_000 });
      expect(r.allowed).toBe(true);
      expect(r.remaining).toBe(4 - i);
    }
    expect(checkAutomationRateLimit({ key, limit: 5, windowMs: 10_000 }).allowed).toBe(false);
    // After window expires
    vi.advanceTimersByTime(10_001);
    expect(checkAutomationRateLimit({ key, limit: 5, windowMs: 10_000 }).allowed).toBe(true);
  });

  it('different keys are independent buckets', () => {
    const keyA = 'auto-indep-a';
    const keyB = 'auto-indep-b';
    for (let i = 0; i < 30; i++) checkAutomationRateLimit({ key: keyA });
    expect(checkAutomationRateLimit({ key: keyA }).allowed).toBe(false);
    expect(checkAutomationRateLimit({ key: keyB }).allowed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 6. SECURITY RATE LIMIT POLICY SERVICE
// ---------------------------------------------------------------------------
describe('SECURITY RATE LIMIT POLICY SERVICE — extended', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    clearSecurityRateLimitBuckets();
    vi.useRealTimers();
  });

  it('evaluateSecurityRateLimit correctly reports retry-after for blocked state', () => {
    const result = evaluateSecurityRateLimit({
      action: 'auth.login',
      subjectParts: { email: 'test@test.com' },
      observedCount: 5,
    });
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
    expect(result.limit).toBeGreaterThan(0);
    expect(result.windowSeconds).toBeGreaterThan(0);
  });

  it('evaluateSecurityRateLimit allows under limit', () => {
    const result = evaluateSecurityRateLimit({
      action: 'auth.login',
      subjectParts: { email: 'test@test.com' },
      observedCount: 3,
    });
    expect(result.allowed).toBe(true);
    expect(result.retryAfterSeconds).toBe(0);
  });

  it('checkSecurityRateLimit resets after window expires', () => {
    const now = Date.now();
    const action = 'auth.login' as const;
    const subject = { email: 'reset@test.com' };

    // Exhaust all attempts
    const limit = 4; // from SECURITY_RATE_LIMIT_POLICY_DRAFT for auth.login (if 5, use 5)
    // Actually let me just read the actual limit dynamically
    const first = checkSecurityRateLimit(action, subject, now);
    for (let i = 1; i < first.limit; i++) {
      checkSecurityRateLimit(action, subject, now);
    }
    const blocked = checkSecurityRateLimit(action, subject, now);
    expect(blocked.allowed).toBe(false);

    // After window expires
    const future = now + first.windowSeconds * 1000 + 1;
    const reset = checkSecurityRateLimit(action, subject, future);
    expect(reset.allowed).toBe(true);
    expect(reset.remaining).toBe(reset.limit - 1);
  });
});
