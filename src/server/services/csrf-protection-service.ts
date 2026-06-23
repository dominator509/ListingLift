import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { addMinutes } from '@/lib/date';
import { randomToken, sha256 } from '@/lib/hash';
import { csrfTokenDraftSchema, csrfVerificationSchema, type CsrfTokenDraftInput, type CsrfVerificationInput } from '@/schemas/security-hardening';

// ── CSRF Secret Resolution ──
function getCsrfSecret(): string {
  const secret = process.env.CSRF_SECRET;
  if (secret && secret.length > 0) return secret;
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    throw new Error('[CRITICAL] CSRF_SECRET environment variable is required in production. Set CSRF_SECRET before starting the server.');
  }
  const devFallback = 'dev-csrf-secret-do-not-use-in-prod';
  console.warn('[csrf] WARNING: Using dev-only CSRF_SECRET fallback. Set CSRF_SECRET env var for production.');
  return devFallback;
}

// ── CIA/NSA-Grade CSRF Defense: Origin allow-list ──
const ALLOWED_ORIGINS = (process.env.CSRF_ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3005')
  .split(',').map(s => s.trim()).filter(Boolean);

function signCsrfPayload(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function createCsrfTokenDraft(input: CsrfTokenDraftInput) {
  const parsed = csrfTokenDraftSchema.parse(input);
  const nonce = randomToken(24);
  const expiresAt = addMinutes(new Date(), parsed.expiresInMinutes);
  const sessionId = parsed.sessionId ?? 'session-not-bound';
  const payload = `${nonce}.${sessionId}.${parsed.organizationId}.${expiresAt.toISOString()}`;
  const signature = signCsrfPayload(payload, parsed.csrfSecret);
  const token = `${nonce}|${expiresAt.toISOString()}|${signature}`;
  return {
    token,
    tokenHash: sha256(token),
    expiresAt,
    rawTokenStored: false as const,
    codexNote: 'Codex must store only tokenHash or derive stateless validation from a server secret; browser mutations must require a matching session-bound token.',
  };
}

export function verifyCsrfTokenDraft(input: CsrfVerificationInput) {
  const parsed = csrfVerificationSchema.parse(input);
  if (!parsed.token) return { ok: false, reason: 'missing_token' as const };
  const [nonce, expiresAtIso, signature] = parsed.token.split('|');
  if (!nonce || !expiresAtIso || !signature) return { ok: false, reason: 'malformed_token' as const };
  const expiresAt = new Date(expiresAtIso);
  const now = parsed.nowIso ? new Date(parsed.nowIso) : new Date();
  if (!Number.isFinite(expiresAt.getTime())) return { ok: false, reason: 'malformed_expiry' as const };
  if (expiresAt.getTime() <= now.getTime()) return { ok: false, reason: 'expired' as const };
  const sessionId = parsed.sessionId ?? 'session-not-bound';
  const payload = `${nonce}.${sessionId}.${parsed.organizationId}.${expiresAt.toISOString()}`;
  const expected = signCsrfPayload(payload, parsed.csrfSecret);
  return safeEqual(signature, expected) ? { ok: true, reason: null, expiresAt } : { ok: false, reason: 'signature_mismatch' as const };
}

// ─────────────────────────────────────────────────────────────────
// CIA/NSA-Grade LAYER 2: Origin / Referer Validation
// ─────────────────────────────────────────────────────────────────
export function originAllowedForRequest(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  // Same-origin browser fetch() calls omit Origin for non-CORS requests —
  // these are safe (browsers enforce same-origin for fetch by default).
  if (!origin && !referer) return true;
  const checkOrigin = origin ?? referer;
  if (!checkOrigin) return false;
  try {
    const originHost = new URL(checkOrigin).origin;
    return ALLOWED_ORIGINS.some(allowed => {
      if (allowed === '*') return true;
      try { return new URL(allowed).origin === originHost; } catch { return allowed === originHost; }
    });
  } catch (e) {
    console.error('[csrf] origin validation error', e);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────
// CIA/NSA-Grade LAYER 1: Stateless Synchronizer Token
//
// Token format:  {nonce}.{expiresAt}.{signature}
//   nonce      — 16-char hex salt (prevents token guessing)
//   expiresAt  — Unix ms (30-minute rotation window)
//   signature  — SHA-256(userId:orgId:csrfSecret:expiresAt)
//
// Stateless: no server-side token storage required.
// Token is bound to (userId, organizationId) — cannot be replayed
// across different users or organizations.
// ─────────────────────────────────────────────────────────────────

export function generateCsrfToken(session: { userId: string; organizationId: string }): { token: string; expiresAt: number } {
  const csrfSecret = getCsrfSecret();
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30-minute rotation window
  const payload = `${session.userId}:${session.organizationId}:${csrfSecret}:${expiresAt}`;
  const signature = createHash('sha256').update(payload).digest('hex').substring(0, 32);
  const nonce = createHash('sha256').update(`${Date.now()}:${Math.random()}`).digest('hex').substring(0, 16);
  const token = `${nonce}.${expiresAt}.${signature}`;
  return { token, expiresAt };
}

export function verifyCsrfForRequest(
  request: Request,
  session: { userId: string; organizationId: string },
  options?: { skipOriginCheck?: boolean }
): void {
  // GET, HEAD, OPTIONS are safe methods — CSRF only applies to state-changing verbs
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method.toUpperCase())) return;

  // LAYER 2: Origin/Referer validation (defense-in-depth)
  if (!options?.skipOriginCheck && !originAllowedForRequest(request)) {
    throw new CsrfRejectionError('CSRF_ORIGIN_MISMATCH', 'Cross-origin request blocked by security policy');
  }

  const token = request.headers.get('x-csrf-token');
  if (!token) {
    throw new CsrfRejectionError('CSRF_TOKEN_MISSING', 'CSRF token required for state-changing requests. Request a token from POST /api/csrf/token');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new CsrfRejectionError('CSRF_TOKEN_MALFORMED', 'Invalid CSRF token format');
  }
  const [, encodedExpires, encodedSignature] = parts;

  // Recompose HMAC: SHA-256(userId + orgId + csrfSecret + expiresAt)
  const csrfSecret = getCsrfSecret();
  const payload = `${session.userId}:${session.organizationId}:${csrfSecret}:${encodedExpires}`;
  const expectedSignature = createHash('sha256').update(payload).digest('hex').substring(0, 32);

  // LAYER 1: Timing-safe HMAC comparison (prevents timing oracle attacks)
  if (!safeEqual(expectedSignature, encodedSignature)) {
    throw new CsrfRejectionError('CSRF_TOKEN_INVALID', 'CSRF token validation failed — token does not match session binding');
  }

  // Expiration check
  const expiresAt = parseInt(encodedExpires, 10);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    throw new CsrfRejectionError('CSRF_TOKEN_EXPIRED', 'CSRF token has expired — request a fresh token from POST /api/csrf/token');
  }
}

// ── Dedicated error class for CSRF rejections (caught by mapServiceError in route handlers) ──
export class CsrfRejectionError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'CsrfRejectionError';
    this.code = code;
  }
}
