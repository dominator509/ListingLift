import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { getEnv } from '@/lib/env';

export const SESSION_TTL_SECONDS = 24 * 60 * 60; // Q14-A3: sessions expire after 24h
export const SESSION_COOKIE_NAME = 'll_session';

const SIGNATURE_SEPARATOR = '.';

/** Sign a raw token with HMAC-SHA256 using the SESSION_SIGNING_SECRET. */
export function signSessionToken(token: string): string {
  const secret = getEnv().SESSION_SIGNING_SECRET;
  return createHmac('sha256', secret).update(token).digest('base64url');
}

/** Verify an HMAC-SHA256 signature against a raw token. Constant-time comparison. */
export function verifySessionTokenSignature(token: string, signature: string): boolean {
  const expected = signSessionToken(token);
  if (expected.length !== signature.length) return false;
  const bufA = Buffer.from(expected, 'utf8');
  const bufB = Buffer.from(signature, 'utf8');
  // constant-time compare to prevent timing oracle
  return timingSafeEqual(bufA, bufB);
}

/**
 * Split a signed token (raw.signature) into its parts.
 * Returns null if malformed.
 */
export function parseSignedToken(signed: string): { raw: string; signature: string } | null {
  const dotIndex = signed.lastIndexOf(SIGNATURE_SEPARATOR);
  if (dotIndex <= 0 || dotIndex === signed.length - 1) return null;
  return { raw: signed.slice(0, dotIndex), signature: signed.slice(dotIndex + 1) };
}

export function createSessionToken(): { token: string; tokenHash: string } {
  const raw = randomBytes(48).toString('base64url');
  const tokenHash = createHash('sha256').update(raw).digest('hex');
  const signature = signSessionToken(raw);
  const token = raw + SIGNATURE_SEPARATOR + signature;
  return { token, tokenHash };
}

export function sessionExpiresAt(now?: Date): Date {
  const base = now ?? new Date();
  return new Date(base.getTime() + SESSION_TTL_SECONDS * 1000);
}

interface SerializeOptions {
  maxAgeSeconds?: number;
  path?: string;
  secure?: boolean;
}

export function serializeSessionCookie(token: string, options?: SerializeOptions): string {
  const parts: string[] = [];
  parts.push(`ll_session=${encodeURIComponent(token)}`);
  parts.push('HttpOnly');
  parts.push('SameSite=Lax');
  if (options?.secure ?? true) parts.push('Secure');
  parts.push(`Path=${options?.path ?? '/'}`);
  parts.push(`Max-Age=${options?.maxAgeSeconds ?? SESSION_TTL_SECONDS}`);
  return parts.join('; ');
}

export function serializeSessionClearCookie(options?: { secure?: boolean }): string {
  const parts: string[] = [];
  parts.push('ll_session=');
  parts.push('HttpOnly');
  parts.push('SameSite=Strict');
  if (options?.secure ?? true) parts.push('Secure');
  parts.push('Path=/');
  parts.push('Max-Age=0');
  return parts.join('; ');
}

export function readSessionCookie(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/ll_session=([^;]*)/);
  if (!match || match[1] === '') return null;
  return decodeURIComponent(match[1]);
}

export function parseSessionCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/ll_session=([^;]+)/);
  return match ? match[1] : null;
}
