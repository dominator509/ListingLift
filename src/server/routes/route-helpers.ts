/**
 * Route-level helpers for extracting validated payloads from requests.
 */

import { checkAuthRateLimit, getRateLimitKey } from '@/server/auth/rate-limit';
import { requireSession } from '@/server/services/auth-session-service';
import { checkIdempotency, storeIdempotency } from '@/server/services/idempotency-service';
import { mapServiceError } from '@/lib/api-response';
import { assertPermission } from '@/server/services/authorization-service';

const DANGEROUS_PROPS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * JSON reviver that blocks prototype pollution via __proto__,
 * constructor, and prototype keys at any nesting level.
 */
function pollutionSafeReviver(_key: string, value: unknown): unknown {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    const sanitized: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (!DANGEROUS_PROPS.has(k)) {
        sanitized[k] = v;
      }
    }
    return sanitized;
  }
  return value;
}

export async function parseJson<T>(request: Request, fallback: T): Promise<T> {
  try {
    const text = await request.text();
    if (!text) return fallback;
    return JSON.parse(text, pollutionSafeReviver) as T;
  } catch (error) {
    console.log(JSON.stringify({
      event: 'parse_json_error',
      method: request.method,
      url: request.url,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 4).join('\n') : undefined,
    }));
    return fallback;
  }
}

function getClientIp(request: Request): string | null {
  return request.headers.get('x-real-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',').pop()?.trim()
    ?? null;
}

/** Wraps a GET handler with session, rate limit, and permission guard. */
export async function guardedGet<T>(
  request: Request,
  permission: string,
  handler: () => Promise<T>,
): Promise<Response> {
  try {
    const session = await requireSession(request);
    assertPermission(session, permission);
    const ip = getClientIp(request);
    const result = await checkAuthRateLimit(getRateLimitKey(session.userId, ip), Date.now(), 30, 15 * 60 * 1000);
    if (!result.allowed) {
      return Response.json(
        { ok: false, error: { code: 'RATE_LIMITED', message: 'Too many requests.' } },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)) } },
      );
    }
    const data = await handler();
    return Response.json({ ok: true, data });
  } catch (error) {
    return mapServiceError(error);
  }
}

/** Wraps a POST handler with session, rate limit, permission, and idempotency guard. */
export async function guardedPost<T>(
  request: Request,
  permission: string,
  handler: (_session: { userId: string; organizationId: string; role: string }) => Promise<T>,
): Promise<Response> {
  try {
    const session = await requireSession(request);
    assertPermission(session, permission);
    const ip = getClientIp(request);
    const result = await checkAuthRateLimit(getRateLimitKey(session.userId, ip), Date.now(), 5, 15 * 60 * 1000);
    if (!result.allowed) {
      return Response.json(
        { ok: false, error: { code: 'RATE_LIMITED', message: 'Too many requests.' } },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)) } },
      );
    }

    // P13: Idempotency check
    const idemp = await checkIdempotency(request, session);
    if (!idemp.shouldProcess) {
      return Response.json(idemp.body, { status: idemp.status });
    }

    const data = await handler(session);

    // Store idempotency result
    await storeIdempotency(request, session, 200, { ok: true, data });

    return Response.json({ ok: true, data });
  } catch (error) {
    return mapServiceError(error);
  }
}

/** Wraps a PATCH handler with session, rate limit, permission, and idempotency guard. */
export async function guardedPatch<T>(
  request: Request,
  permission: string,
  handler: (_session: { userId: string; organizationId: string; role: string }) => Promise<T>,
): Promise<Response> {
  try {
    const session = await requireSession(request);
    assertPermission(session, permission);
    const ip = getClientIp(request);
    const result = await checkAuthRateLimit(getRateLimitKey(session.userId, ip), Date.now(), 5, 15 * 60 * 1000);
    if (!result.allowed) {
      return Response.json(
        { ok: false, error: { code: 'RATE_LIMITED', message: 'Too many requests.' } },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)) } },
      );
    }

    // P13: Idempotency check
    const idemp = await checkIdempotency(request, session);
    if (!idemp.shouldProcess) {
      return Response.json(idemp.body, { status: idemp.status });
    }

    const data = await handler(session);

    // Store idempotency result
    await storeIdempotency(request, session, 200, { ok: true, data });

    return Response.json({ ok: true, data });
  } catch (error) {
    return mapServiceError(error);
  }
}

/** Wraps a handler that needs only a valid session (no specific permission). */
export async function guardedSession<T>(
  request: Request,
  handler: (_session: { userId: string; organizationId: string; role: string; organizationType?: string }) => Promise<T>,
): Promise<Response> {
  try {
    const session = await requireSession(request);
    const ip = getClientIp(request);
    const result = await checkAuthRateLimit(getRateLimitKey(session.userId, ip), Date.now(), 30, 15 * 60 * 1000);
    if (!result.allowed) {
      return Response.json(
        { ok: false, error: { code: 'RATE_LIMITED', message: 'Too many requests.' } },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)) } },
      );
    }
    const data = await handler(session);
    return Response.json({ ok: true, data });
  } catch (error) {
    return mapServiceError(error);
  }
}
