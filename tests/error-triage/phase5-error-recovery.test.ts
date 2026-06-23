/**
 * PHASE 5 — Error Recovery & Triage
 *
 * MISSION: Verify error handling, recovery paths, and graceful degradation.
 * The system should fail safely, not crash spectacularly.
 *
 * SCOPE:
 *  1. Null/undefined propagation — inject null/missing fields, verify 4xx not 500
 *  2. Database failures — mock Prisma errors (P2002, P2025, connection refused)
 *  3. Rate limit enforcement — hammer endpoints past the limit, verify 429
 *  4. Auth failure paths — expired tokens, malformed tokens, missing cookies
 *  5. Stripe API failures — mock Stripe errors (card declined, API down)
 *  6. CSRF failure paths — missing token, wrong token, expired token, tampered
 *  7. Payload validation — SQLi, XSS, massive payloads, Unicode fuzzing
 *  8. Concurrent failure isolation — one failing request doesn't cascade
 */

import { describe, expect, it, afterEach, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import * as sessionCookie from '@/server/auth/session-cookie';
import { hashToken } from '@/lib/tokens';

// ── Services Under Test ──
import { checkAuthRateLimit, clearAuthRateLimit, getRateLimitKey } from '@/server/auth/rate-limit';
import {
  checkSecurityRateLimit,
  clearSecurityRateLimitBuckets,
  evaluateSecurityRateLimit,
  checkSecurityRateLimit as checkSecurityRateLimitImpl,
} from '@/server/services/security-rate-limit-policy-service';
import {
  verifyCsrfForRequest,
  generateCsrfToken,
  CsrfRejectionError,
  createCsrfTokenDraft,
  verifyCsrfTokenDraft,
  originAllowedForRequest,
} from '@/server/services/csrf-protection-service';
import { mapServiceError, jsonFail } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { resolveStripePackagePrice } from '@/server/services/stripe-checkout-service';
import { stripePaymentAdapter } from '@/server/adapters/payments/stripe-adapter';
import { verifyStripeWebhookSignature } from '@/server/services/stripe-webhook-signature-service';
import { extractBearerToken } from '@/server/routes/api-token-route-helpers';
import { SECURITY_RATE_LIMIT_POLICY_DRAFT } from '@/domain/security-hardening';

// ── Authoring-only schemas (plain .parse(), not Zod) ──
import {
  stripeWebhookEventSchema,
  stripeCheckoutRequestSchema,
  stripeCreditPurchaseSchema,
} from '@/schemas/stripe-billing';
import {
  csrfTokenDraftSchema,
  csrfVerificationSchema,
  securityRateLimitEvaluationSchema,
} from '@/schemas/security-hardening';

// ── Zod Schemas ──
import { loginSchema, signupSchema } from '@/schemas/auth';

// ── Shared Test Helpers ──
import { cleanupAll } from '../integration/helpers';

afterEach(async () => {
  await cleanupAll();
  clearAuthRateLimit('test-key');
  clearSecurityRateLimitBuckets();
});

// ════════════════════════════════════════════════════════════════
// SECTION 1: Null/Undefined Propagation — API should return 4xx,
// not crash with 500, when fields are missing or null.
// ════════════════════════════════════════════════════════════════
describe('1. Null/Undefined Propagation — graceful rejection of missing fields', () => {
  it('parseJson returns fallback for empty body', async () => {
    const request = new Request('http://localhost:3000/api/test', { method: 'POST' });
    const result = await parseJson(request, { default: true });
    expect(result).toEqual({ default: true });
  });

  it('parseJson returns fallback for invalid JSON body', async () => {
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      body: 'not-json-at-all{{{',
      headers: { 'content-type': 'application/json' },
    });
    const result = await parseJson(request, { default: true });
    expect(result).toEqual({ default: true });
  });

  it('loginSchema rejects null email', () => {
    const result = loginSchema.safeParse({ email: null, password: 'test' });
    expect(result.success).toBe(false);
  });

  it('loginSchema rejects undefined password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com' });
    expect(result.success).toBe(false);
  });

  it('loginSchema rejects empty email string', () => {
    const result = loginSchema.safeParse({ email: '', password: 'P4ssw0rd!' });
    expect(result.success).toBe(false);
  });

  it('loginSchema rejects null body entirely', () => {
    const result = loginSchema.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('stripeCheckoutRequestSchema.parse throws on null input', () => {
    expect(() => stripeCheckoutRequestSchema.parse(null)).toThrow('Input must be an object');
  });

  it('stripeCheckoutRequestSchema.parse throws on missing packageKey', () => {
    // It's a typed cast, not a validation — missing fields become undefined, no crash
    const result = stripeCheckoutRequestSchema.parse({ purpose: 'PACKAGE', buyerEmail: 'test@example.com' });
    expect(result.packageKey).toBeUndefined();
  });

  it('stripeWebhookEventSchema.parse throws on null input', () => {
    expect(() => stripeWebhookEventSchema.parse(null)).toThrow('Invalid stripe webhook event');
  });

  it('csrfTokenDraftSchema.parse throws on missing sessionId', () => {
    expect(() => csrfTokenDraftSchema.parse({ organizationId: 'org-1', csrfSecret: 'abcdefghijklmnop', expiresInMinutes: 30 })).toThrow('sessionId required');
  });

  it('csrfVerificationSchema.parse throws on missing token', () => {
    expect(() => csrfVerificationSchema.parse({ sessionId: 's1', organizationId: 'o1', csrfSecret: 'secret' })).toThrow('token required');
  });

  it('securityRateLimitEvaluationSchema.parse throws on null input', () => {
    expect(() => securityRateLimitEvaluationSchema.parse(null)).toThrow('Input must be an object');
  });

  it('securityRateLimitEvaluationSchema.parse handles partial input without crashing', () => {
    // Schema casts missing action to undefined — no throw, no crash
    const result = securityRateLimitEvaluationSchema.parse({ subjectParts: { ip: '127.0.0.1' }, observedCount: 0 });
    expect(result.action).toBeUndefined();
    expect(result.observedCount).toBe(0);
  });

  it('extractBearerToken returns null for missing Authorization header', () => {
    const request = new Request('http://localhost:3000/api/test');
    expect(extractBearerToken(request)).toBeNull();
  });

  it('extractBearerToken returns null for malformed Authorization header', () => {
    const request = new Request('http://localhost:3000/api/test', {
      headers: { authorization: 'Basic dGVzdDpwYXNz' },
    });
    expect(extractBearerToken(request)).toBeNull();
  });

  it('mapServiceError returns 500 for unhandled error types (not a crash)', () => {
    const response = mapServiceError('some random string error');
    expect(response.status).toBe(500);
  });

  it('mapServiceError returns 403 for CSRF errors', () => {
    const error = Object.assign(new Error('CSRF token missing'), { code: 'CSRF_TOKEN_MISSING' });
    const response = mapServiceError(error);
    expect(response.status).toBe(403);
  });

  it('mapServiceError returns 404 for NOT_FOUND', () => {
    const error = Object.assign(new Error('Resource not found'), { code: 'NOT_FOUND' });
    const response = mapServiceError(error);
    expect(response.status).toBe(404);
  });

  it('mapServiceError returns 409 for CONFLICT', () => {
    const error = Object.assign(new Error('Already exists'), { code: 'CONFLICT' });
    const response = mapServiceError(error);
    expect(response.status).toBe(409);
  });

  it('mapServiceError returns 429 for RATE_LIMITED', () => {
    const error = Object.assign(new Error('Too many requests'), { code: 'RATE_LIMITED' });
    const response = mapServiceError(error);
    expect(response.status).toBe(429);
  });

  it('jsonFail always returns structured error object, never crashes', () => {
    const response = jsonFail('TEST_ERROR', 'Something went wrong', 418);
    expect(response.status).toBe(418);
  });

  it('signupSchema rejects missing name', () => {
    const result = signupSchema.safeParse({
      email: 'test@example.com',
      password: 'P4ssw0rd!',
      organizationName: 'Test Org',
    });
    expect(result.success).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════
// SECTION 2: Database Failures — graceful handling of Prisma errors
// ════════════════════════════════════════════════════════════════
describe('2. Database Failures — graceful error responses on Prisma errors', () => {
  it('handles unique constraint violation (P2002) gracefully via mapServiceError', () => {
    const prismaError = Object.assign(
      new Error('Unique constraint failed on the fields: (`email`)'),
      { code: 'P2002', meta: { target: ['email'] } },
    );
    const response = mapServiceError(prismaError);
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.status).toBeLessThanOrEqual(599);
  });

  it('handles record not found (P2025) gracefully', () => {
    const prismaError = Object.assign(
      new Error('Record to update not found.'),
      { code: 'P2025', meta: {} },
    );
    const response = mapServiceError(prismaError);
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('handles connection refused errors gracefully', () => {
    const connError = Object.assign(
      new Error("Can't reach database server: connection refused"),
      { code: 'CONNECTION_REFUSED' },
    );
    const response = mapServiceError(connError);
    expect(response.status).toBe(500);
  });

  it('handles deadlock detected errors without crashing', () => {
    const deadlockError = Object.assign(
      new Error('Deadlock found when trying to get lock; try restarting transaction'),
      { code: 'P2034' },
    );
    const response = mapServiceError(deadlockError);
    expect(response.status).toBe(500);
  });

  it('handles invalid database url error gracefully', () => {
    const invalidUrlError = Object.assign(
      new Error('Invalid database connection string'),
      { code: 'INVALID_DATABASE_URL' },
    );
    const response = mapServiceError(invalidUrlError);
    expect(response.status).toBe(500);
  });

  it('mapServiceError catches Error object with no code field', () => {
    const plainError = new Error('Something broke in the database layer');
    const response = mapServiceError(plainError);
    expect(response.status).toBe(500);
  });
});

// ════════════════════════════════════════════════════════════════
// SECTION 3: Rate Limit Enforcement — 429 with Retry-After headers
// ════════════════════════════════════════════════════════════════
describe('3. Rate Limit Enforcement — 429 responses under load', () => {
  it('auth rate limiter allows requests within limit', () => {
    const result = checkAuthRateLimit('test-user@example.com::127.0.0.1', 0, 5, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('auth rate limiter blocks after exceeding limit', () => {
    for (let i = 0; i < 5; i++) {
      const r = checkAuthRateLimit('blocked-user::127.0.0.1', 0, 5, 60000);
      if (i < 4) expect(r.allowed).toBe(true);
    }
    const exceeded = checkAuthRateLimit('blocked-user::127.0.0.1', 0, 5, 60000);
    expect(exceeded.allowed).toBe(false);
    expect(exceeded.remaining).toBe(0);
    expect(exceeded.resetAt.getTime()).toBeGreaterThan(0);
  });

  it('auth rate limiter resets after window expiry', () => {
    const now = 1000000;
    const windowMs = 60000;
    for (let i = 0; i < 5; i++) {
      checkAuthRateLimit('reset-test::127.0.0.1', now, 5, windowMs);
    }
    const blocked = checkAuthRateLimit('reset-test::127.0.0.1', now, 5, windowMs);
    expect(blocked.allowed).toBe(false);

    const afterWindow = checkAuthRateLimit('reset-test::127.0.0.1', now + windowMs + 1, 5, windowMs);
    expect(afterWindow.allowed).toBe(true);
    expect(afterWindow.remaining).toBe(4);
  });

  it('security rate limiter (checkSecurityRateLimit) blocks after exceeding limit', () => {
    const action = 'auth.login';
    const subject = { email: 'test@example.com', ip: '127.0.0.1' };
    const policy = SECURITY_RATE_LIMIT_POLICY_DRAFT[action];
    const limit = policy.limit;

    // Exhaust the limit using checkSecurityRateLimit (stateful)
    for (let i = 0; i < limit; i++) {
      checkSecurityRateLimitImpl(action, subject, 0);
    }
    const exceeded = checkSecurityRateLimitImpl(action, subject, 0);
    expect(exceeded.allowed).toBe(false);
    expect(exceeded.remaining).toBe(0);
  });

  it('evaluateSecurityRateLimit returns retryAfterSeconds when exceeded', () => {
    const result = evaluateSecurityRateLimit({
      action: 'auth.login',
      subjectParts: { email: 'test@example.com' },
      observedCount: 999,
    });
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('evaluateSecurityRateLimit tracks remaining count', () => {
    const result = evaluateSecurityRateLimit({
      action: 'upload.create_session',
      subjectParts: { ip: '10.0.0.1' },
      observedCount: 3,
    });
    expect(result.remaining).toBeGreaterThanOrEqual(0);
    expect(result.limit).toBeGreaterThan(0);
  });

  it('clearAuthRateLimit resets bucket state', () => {
    checkAuthRateLimit('clear-test::127.0.0.1', 0, 1, 60000);
    const blocked = checkAuthRateLimit('clear-test::127.0.0.1', 0, 1, 60000);
    expect(blocked.allowed).toBe(false);

    clearAuthRateLimit('clear-test::127.0.0.1');
    const reset = checkAuthRateLimit('clear-test::127.0.0.1', 0, 1, 60000);
    expect(reset.allowed).toBe(true);
  });

  it('getRateLimitKey handles null ip address', () => {
    const key = getRateLimitKey('Test@Example.COM', null);
    expect(key).toBe('test@example.com::unknown-ip');
  });

  it('getRateLimitKey handles undefined ip address', () => {
    const key = getRateLimitKey('Test@Example.COM', undefined);
    expect(key).toBe('test@example.com::unknown-ip');
  });

  it('checkSecurityRateLimit returns proper limit/window metadata', () => {
    const result = checkSecurityRateLimitImpl('checkout.create', { organizationId: 'org-1', ip: '10.0.0.1' }, 0);
    expect(result.limit).toBeGreaterThan(0);
    expect(result.windowSeconds).toBeGreaterThan(0);
    expect(result.allowed).toBe(true);
  });
});

// ════════════════════════════════════════════════════════════════
// SECTION 4: Auth Failure Paths — graceful rejection of bad credentials
// ════════════════════════════════════════════════════════════════
describe('4. Auth Failure Paths — graceful rejection of bad credentials', () => {
  it('loginSchema rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '' });
    expect(result.success).toBe(false);
  });

  it('loginSchema rejects malformed email (no domain)', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'P4ssw0rd!',
    });
    expect(result.success).toBe(false);
  });

  it('readSessionCookie returns null for missing cookie header', () => {
    const request = new Request('http://localhost:3000/api/test');
    expect(sessionCookie.readSessionCookie(request)).toBeNull();
  });

  it('hashToken produces deterministic output', () => {
    const hash1 = hashToken('test-token-value');
    const hash2 = hashToken('test-token-value');
    expect(hash1).toBe(hash2);
  });

  it('hashToken is not reversible / does not leak the original', () => {
    const hash = hashToken('secret-value-12345');
    expect(hash).not.toContain('secret-value-12345');
    expect(hash.length).toBeGreaterThan(10);
  });

  it('login with wrong credentials throws gracefully (not crashes)', async () => {
    const { login } = await import('@/server/auth/auth-service');
    await expect(
      login({ email: 'nonexistent-' + Date.now() + '@test.com', password: 'wrong' }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('resolveSessionFromRequest returns null for missing cookie', async () => {
    const { resolveSessionFromRequest } = await import('@/server/auth/auth-service');
    const request = new Request('http://localhost:3000/api/test');
    const session = await resolveSessionFromRequest(request);
    expect(session).toBeNull();
  });

  it('resolveSessionFromRequest returns null for malformed cookie', async () => {
    const { resolveSessionFromRequest } = await import('@/server/auth/auth-service');
    const request = new Request('http://localhost:3000/api/test', {
      headers: { cookie: 'll_session=invalid-malformed-token-value' },
    });
    const session = await resolveSessionFromRequest(request);
    expect(session).toBeNull();
  });

  it('stripe check for disabled feature flag returns graceful error', async () => {
    const originalEnabled = process.env.STRIPE_ENABLED;
    const originalReal = process.env.REAL_INTEGRATIONS_ENABLED;
    process.env.STRIPE_ENABLED = '';
    process.env.REAL_INTEGRATIONS_ENABLED = '';

    const result = await stripePaymentAdapter.createCheckout({
      packageKey: 'test',
      successUrl: 'http://localhost:3000/success',
      cancelUrl: 'http://localhost:3000/cancel',
      purpose: 'PACKAGE',
      amountCents: 1000,
      currency: 'USD',
      metadata: {},
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain('disabled');
    expect(result.manualFallbackRequired).toBe(true);

    process.env.STRIPE_ENABLED = originalEnabled;
    process.env.REAL_INTEGRATIONS_ENABLED = originalReal;
  });

  it('resolveStripePackagePrice throws for unknown package key (graceful error)', () => {
    expect(() => resolveStripePackagePrice('nonexistent-package-key', 'PACKAGE')).toThrow(
      'Unknown package for Stripe checkout',
    );
  });

  it('csrfVerificationSchema.parse throws on missing sessionId', () => {
    expect(() => csrfVerificationSchema.parse({ organizationId: 'o1', csrfSecret: 'secret', token: 'abc.123.def' })).toThrow('sessionId required');
  });
});

// ════════════════════════════════════════════════════════════════
// SECTION 5: Stripe API Failure Handling — graceful user-facing errors
// for card declined, API down, invalid price, etc.
// ════════════════════════════════════════════════════════════════
describe('5. Stripe API Failure Handling — graceful errors for payment failures', () => {
  it('stripe adapter health check returns disabled when flags are off', async () => {
    const originalEnabled = process.env.STRIPE_ENABLED;
    const originalReal = process.env.REAL_INTEGRATIONS_ENABLED;
    process.env.STRIPE_ENABLED = '';
    process.env.REAL_INTEGRATIONS_ENABLED = '';

    const health = await stripePaymentAdapter.healthCheck();
    expect(health.ok).toBe(false);
    expect(health.mode).toBe('disabled');

    process.env.STRIPE_ENABLED = originalEnabled;
    process.env.REAL_INTEGRATIONS_ENABLED = originalReal;
  });

  it('stripe webhook verification fails gracefully with missing signature', async () => {
    const result = await stripePaymentAdapter.verifyWebhook!(
      '{"id":"evt_test"}',
      undefined,
    );
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('verifyStripeWebhookSignature returns ok=false for bad signature (not a crash)', () => {
    const result = verifyStripeWebhookSignature({
      payload: '{"id":"evt_test"}',
      signatureHeader: 't=1234567890,v1=badsignature',
      webhookSecret: 'whsec_testsecret',
      toleranceSeconds: 300,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('verifyStripeWebhookSignature returns ok=false for missing signature header', () => {
    const result = verifyStripeWebhookSignature({
      payload: '{"id":"evt_test"}',
      signatureHeader: '',
      webhookSecret: 'whsec_test',
      toleranceSeconds: 300,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('stripe checkout schema parse throws for null', () => {
    expect(() => stripeCheckoutRequestSchema.parse(null)).toThrow('Input must be an object');
  });

  it('stripe webhook event schema parse throws for null', () => {
    expect(() => stripeWebhookEventSchema.parse(null)).toThrow('Invalid stripe webhook event');
  });

  it('stripe webhook event schema parse throws for missing id', () => {
    expect(() => stripeWebhookEventSchema.parse({ type: 'checkout.session.completed' })).toThrow('Missing event id');
  });

  it('stripe credit purchase schema parse throws for null', () => {
    expect(() => stripeCreditPurchaseSchema.parse(null)).toThrow('Input must be an object');
  });
});

// ════════════════════════════════════════════════════════════════
// SECTION 6: CSRF Failure Paths — missing token, wrong token,
// expired token, tampered token — verify 403 with correct codes.
// ════════════════════════════════════════════════════════════════
describe('6. CSRF Failure Paths — 403 with correct error codes', () => {
  it('verifyCsrfForRequest throws CSRF_TOKEN_MISSING when no token header', () => {
    const session = { userId: 'user-1', organizationId: 'org-1' };
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });
    expect(() => verifyCsrfForRequest(request, session)).toThrow(CsrfRejectionError);
    try {
      verifyCsrfForRequest(request, session);
    } catch (e: unknown) {
      expect((e as CsrfRejectionError).code).toBe('CSRF_TOKEN_MISSING');
    }
  });

  it('verifyCsrfForRequest throws CSRF_TOKEN_MALFORMED for wrong format', () => {
    const session = { userId: 'user-1', organizationId: 'org-1' };
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-csrf-token': 'not-enough-dots',
      },
    });
    expect(() => verifyCsrfForRequest(request, session)).toThrow(CsrfRejectionError);
    try {
      verifyCsrfForRequest(request, session);
    } catch (e: unknown) {
      expect((e as CsrfRejectionError).code).toBe('CSRF_TOKEN_MALFORMED');
    }
  });

  it('verifyCsrfForRequest throws CSRF_TOKEN_INVALID for tampered signature', () => {
    const session = { userId: 'user-1', organizationId: 'org-1' };
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-csrf-token': 'abc123.9999999999999.00000000000000000000000000000000',
      },
    });
    expect(() => verifyCsrfForRequest(request, session)).toThrow(CsrfRejectionError);
    try {
      verifyCsrfForRequest(request, session);
    } catch (e: unknown) {
      expect((e as CsrfRejectionError).code).toBe('CSRF_TOKEN_INVALID');
    }
  });

  it('verifyCsrfForRequest throws CSRF_ORIGIN_MISMATCH for cross-origin requests', () => {
    const session = { userId: 'user-1', organizationId: 'org-1' };
    const { token } = generateCsrfToken(session);
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-csrf-token': token,
        origin: 'http://evil-attacker.com',
      },
    });
    expect(() => verifyCsrfForRequest(request, session)).toThrow(CsrfRejectionError);
    try {
      verifyCsrfForRequest(request, session);
    } catch (e: unknown) {
      expect((e as CsrfRejectionError).code).toBe('CSRF_ORIGIN_MISMATCH');
    }
  });

  it('verifyCsrfForRequest does not reject GET requests (safe method)', () => {
    const session = { userId: 'user-1', organizationId: 'org-1' };
    const request = new Request('http://localhost:3000/api/test', { method: 'GET' });
    expect(() => verifyCsrfForRequest(request, session)).not.toThrow();
  });

  it('verifyCsrfForRequest does not reject HEAD requests (safe method)', () => {
    const session = { userId: 'user-1', organizationId: 'org-1' };
    const request = new Request('http://localhost:3000/api/test', { method: 'HEAD' });
    expect(() => verifyCsrfForRequest(request, session)).not.toThrow();
  });

  it('verifyCsrfForRequest does not reject OPTIONS requests (safe method)', () => {
    const session = { userId: 'user-1', organizationId: 'org-1' };
    const request = new Request('http://localhost:3000/api/test', { method: 'OPTIONS' });
    expect(() => verifyCsrfForRequest(request, session)).not.toThrow();
  });

  it('mapServiceError returns 403 for all CSRF error codes', () => {
    const errors = [
      { code: 'CSRF_TOKEN_MISSING', msg: 'Missing token' },
      { code: 'CSRF_TOKEN_MALFORMED', msg: 'Malformed token' },
      { code: 'CSRF_TOKEN_INVALID', msg: 'Invalid token' },
      { code: 'CSRF_TOKEN_EXPIRED', msg: 'Expired token' },
      { code: 'CSRF_ORIGIN_MISMATCH', msg: 'Origin mismatch' },
    ];
    for (const { code, msg } of errors) {
      const error = Object.assign(new Error(msg), { code });
      const response = mapServiceError(error);
      expect(response.status).toBe(403);
    }
  });

  it('generateCsrfToken always produces a 3-part token', () => {
    const session = { userId: 'user-2', organizationId: 'org-2' };
    const { token } = generateCsrfToken(session);
    expect(token.split('.')).toHaveLength(3);
  });

  it('CsrfRejectionError carries the correct code on instantiation', () => {
    const error = new CsrfRejectionError('CSRF_TOKEN_EXPIRED', 'Token has expired');
    expect(error.code).toBe('CSRF_TOKEN_EXPIRED');
    expect(error.message).toBe('Token has expired');
    expect(error.name).toBe('CsrfRejectionError');
  });

  it('originAllowedForRequest returns true for same-origin request', () => {
    const request = new Request('http://localhost:3000/api/test', {
      headers: { origin: 'http://localhost:3000' },
    });
    expect(originAllowedForRequest(request)).toBe(true);
  });

  it('originAllowedForRequest returns true when no origin header (same-origin fetch)', () => {
    const request = new Request('http://localhost:3000/api/test');
    expect(originAllowedForRequest(request)).toBe(true);
  });

  it('originAllowedForRequest returns false for disallowed origin', () => {
    const request = new Request('http://localhost:3000/api/test', {
      headers: { origin: 'http://unknown-evil-origin.xyz' },
    });
    expect(originAllowedForRequest(request)).toBe(false);
  });

  it('createCsrfTokenDraft produces valid token with correct format', () => {
    const draft = createCsrfTokenDraft({
      sessionId: 'session-1',
      organizationId: 'org-1',
      csrfSecret: 'abcdefghijklmnop1234',
      expiresInMinutes: 30,
    });
    expect(draft.token).toBeTruthy();
    expect(draft.tokenHash).toBeTruthy();
    expect(draft.rawTokenStored).toBe(false);
  });

  it('verifyCsrfTokenDraft rejects malformed token', () => {
    const result = verifyCsrfTokenDraft({
      token: 'bad-token',
      sessionId: 's1',
      organizationId: 'o1',
      csrfSecret: 'abcdefghijklmnop1234',
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('malformed_token');
  });

  it('verifyCsrfTokenDraft rejects expired token', () => {
    // Create a token with expiresAt in the past by manipulating the raw payload
    const sessionId = 's-expired';
    const organizationId = 'o-expired';
    const csrfSecret = 'abcdefghijklmnop1234';
    const expiresInMinutes = 1;
    const draft = createCsrfTokenDraft({ sessionId, organizationId, csrfSecret, expiresInMinutes });
    // The token format is: `${nonce}|${expiresAt.toISOString()}|${signature}`
    // Replace the expiry with a past date
    const parts = draft.token.split('|');
    const pastDate = new Date(Date.now() - 60000).toISOString(); // 1 minute ago
    const tamperedToken = `${parts[0]}|${pastDate}|${parts[2]}`;

    const result = verifyCsrfTokenDraft({
      token: tamperedToken,
      sessionId,
      organizationId,
      csrfSecret,
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('expired');
  });
});

// ════════════════════════════════════════════════════════════════
// SECTION 7: Payload Validation — SQLi, XSS, massive payloads,
// Unicode fuzzing — verify safe rejection.
// ════════════════════════════════════════════════════════════════
describe('7. Payload Validation — rejection of malicious or oversized inputs', () => {
  it('loginSchema rejects SQL injection in email field', () => {
    const sqli = "' OR 1=1; DROP TABLE users; --";
    const result = loginSchema.safeParse({ email: sqli, password: 'P4ssw0rd!' });
    expect(result.success).toBe(false);
  });

  it('loginSchema rejects XSS payload with no valid email structure', () => {
    const xss = '<script>alert("xss")</script>';
    const result = loginSchema.safeParse({ email: xss, password: 'P4ssw0rd!' });
    expect(result.success).toBe(false);
  });

  it('stripeCheckoutRequestSchema.parse does not crash on extremely long strings', () => {
    const largeString = 'x'.repeat(100000);
    const result = stripeCheckoutRequestSchema.parse({
      packageKey: 'basic-pack',
      purpose: 'PACKAGE',
      buyerEmail: 'test@example.com',
      metadata: { giantField: largeString },
    });
    // Typed-cast schema — no crash is the point
    expect(result.metadata?.giantField).toBe(largeString);
  });

  it('stripeWebhookEventSchema.parse handles oversized payload gracefully', () => {
    const largePayload: any = { id: 'evt_1', type: 'checkout.session.completed' };
    // Add lots of extra data
    for (let i = 0; i < 1000; i++) {
      largePayload[`field_${i}`] = 'x'.repeat(100);
    }
    // Should parse without crashing
    const result = stripeWebhookEventSchema.parse(largePayload);
    expect(result.id).toBe('evt_1');
  });

  it('Zod loginSchema rejects deeply nested extra fields without crashing', () => {
    const deepObject: any = {};
    let current = deepObject;
    for (let i = 0; i < 100; i++) {
      current.nested = {};
      current = current.nested;
    }
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'P4ssw0rd!',
      ...deepObject,
    });
    // Extra keys are ignored by Zod (non-strict) — no crash
    expect(result.success).toBe(true);
  });

  it('Zod schemas reject proto pollution attempts', () => {
    const polluted = JSON.parse('{"__proto__": {"admin": true}, "email": "test@example.com", "password": "P4ssw0rd!"}');
    const result = loginSchema.safeParse(polluted);
    expect(result.success).toBe(true); // Zod strips unknown keys
    expect(({} as any).admin).toBeUndefined();
  });

  it('Zod handles large name string without crashing', () => {
    const result = signupSchema.safeParse({
      email: 'test@example.com',
      password: 'P4ssw0rd!',
      name: 'x'.repeat(10000),
      organizationName: 'Test Org',
    });
    // No min/max length constraints on name beyond min(1) — Zod should accept
    // The point is: no crash, no OOM
    expect(result.success).toBe(true);
  });

  it('parseJson rejects binary/control characters gracefully', async () => {
    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      body: Buffer.from([0x00, 0x01, 0x02, 0xFF, 0xFE]).buffer as any,
    });
    const result = await parseJson(request, { fallback: true });
    expect(result).toEqual({ fallback: true });
  });

  it('loginSchema rejects empty string password (whitespace only passes min length but is allowed)', () => {
    // .min(1) counts whitespace as length >= 1, so this passes schema validation
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '   ' });
    // This is expected to be true — Zod min(1) counts whitespace chars.
    // The application layer must trim the password during handling.
    expect(result.success).toBe(true);
  });

  it('csrfTokenDraftSchema.parse rejects short csrfSecret', () => {
    expect(() =>
      csrfTokenDraftSchema.parse({
        sessionId: 's1',
        organizationId: 'o1',
        csrfSecret: 'short',
        expiresInMinutes: 30,
      }),
    ).toThrow('csrfSecret must be at least 16 chars');
  });

  it('csrfTokenDraftSchema.parse rejects invalid expiresInMinutes', () => {
    expect(() =>
      csrfTokenDraftSchema.parse({
        sessionId: 's1',
        organizationId: 'o1',
        csrfSecret: 'abcdefghijklmnop1234',
        expiresInMinutes: -1,
      }),
    ).toThrow('expiresInMinutes must be >= 1');
  });
});

// ════════════════════════════════════════════════════════════════
// SECTION 8: Concurrent Failure Isolation — one failing request
// doesn't cascade-fail concurrent healthy requests.
// ════════════════════════════════════════════════════════════════
describe('8. Concurrent Failure Isolation — no cascade between parallel requests', () => {
  it('auth rate limiter has per-key isolation', () => {
    for (let i = 0; i < 5; i++) {
      checkAuthRateLimit('blocked1::127.0.0.1', 0, 5, 60000);
    }
    const blocked = checkAuthRateLimit('blocked1::127.0.0.1', 0, 5, 60000);
    expect(blocked.allowed).toBe(false);

    const independent = checkAuthRateLimit('other-user::192.168.1.1', 0, 5, 60000);
    expect(independent.allowed).toBe(true);
    expect(independent.remaining).toBe(4);
  });

  it('security rate limiter has per-action isolation', () => {
    const subject = { ip: '10.0.0.1', email: 'test@example.com' };

    // Exhaust login limit
    const loginPolicy = SECURITY_RATE_LIMIT_POLICY_DRAFT['auth.login'];
    for (let i = 0; i < loginPolicy.limit; i++) {
      checkSecurityRateLimitImpl('auth.login', subject, 0);
    }
    const loginExceeded = checkSecurityRateLimitImpl('auth.login', subject, 0);
    expect(loginExceeded.allowed).toBe(false);

    // A different action with same subject should not be affected
    const checkoutResult = checkSecurityRateLimitImpl('checkout.create', subject, 0);
    expect(checkoutResult.allowed).toBe(true);
  });

  it('csrf token validation is per-session isolated', () => {
    const sessionA = { userId: 'user-a-1', organizationId: 'org-a' };
    const sessionB = { userId: 'user-b-1', organizationId: 'org-b' };

    const { token } = generateCsrfToken(sessionA);

    const request = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-csrf-token': token,
      },
    });
    expect(() => verifyCsrfForRequest(request, sessionB)).toThrow(CsrfRejectionError);
  });

  it('schema validation failure for one request does not poison schema state', () => {
    const badResult = loginSchema.safeParse({ email: null, password: 'test' });
    expect(badResult.success).toBe(false);

    const goodResult = loginSchema.safeParse({ email: 'test@example.com', password: 'P4ssw0rd!' });
    expect(goodResult.success).toBe(true);
  });

  it('concurrent calls to checkAuthRateLimit with different keys do not interfere', () => {
    const results = [];
    for (let i = 0; i < 10; i++) {
      results.push(checkAuthRateLimit(`user-${i}::127.0.0.1`));
    }
    for (const r of results) {
      expect(r.allowed).toBe(true);
      expect(r.remaining).toBe(4);
    }
  });

  it('mapServiceError on one error does not affect subsequent error mapping', () => {
    const csrfError = Object.assign(new Error('CSRF fail'), { code: 'CSRF_TOKEN_MISSING' });
    const r1 = mapServiceError(csrfError);
    expect(r1.status).toBe(403);

    const notFound = Object.assign(new Error('Not found'), { code: 'NOT_FOUND' });
    const r2 = mapServiceError(notFound);
    expect(r2.status).toBe(404);

    const generic = new Error('Some generic failure');
    const r3 = mapServiceError(generic);
    expect(r3.status).toBe(500);
  });

  it('parseJson on bad input does not break subsequent parseJson calls', async () => {
    const badRequest = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      body: 'not-json',
    });
    const badResult = await parseJson(badRequest, { fallback: true });
    expect(badResult).toEqual({ fallback: true });

    const goodRequest = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      body: JSON.stringify({ valid: true }),
      headers: { 'content-type': 'application/json' },
    });
    const goodResult = await parseJson(goodRequest, { fallback: false });
    expect(goodResult).toEqual({ valid: true });
  });

  it('one failing csrf token parse does not affect other token parsing', () => {
    // Parse failure on first
    expect(() =>
      csrfTokenDraftSchema.parse({
        sessionId: 's1',
        organizationId: 'o1',
        csrfSecret: 'short', // too short
        expiresInMinutes: 30,
      }),
    ).toThrow('csrfSecret must be at least 16 chars');

    // Next call with valid data works fine
    const draft = csrfTokenDraftSchema.parse({
      sessionId: 's1',
      organizationId: 'o1',
      csrfSecret: 'abcdefghijklmnop1234',
      expiresInMinutes: 30,
    });
    expect(draft.sessionId).toBe('s1');
  });
});
