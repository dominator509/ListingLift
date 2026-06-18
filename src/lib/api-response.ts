import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { createHash } from 'node:crypto';

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, { status: 200, ...init });
}

/**
 * jsonOk with an ETag header computed from the response body for client-side caching.
 * If the request includes an If-None-Match header matching the ETag, returns 304 Not Modified.
 */
export function etaggedJsonOk<T>(data: T, request: Request, init?: ResponseInit): NextResponse {
  const body = JSON.stringify({ ok: true, data });
  const etag = `"${createHash('md5').update(body).digest('hex')}"`;

  if (request.headers.get('if-none-match') === etag) {
    return new NextResponse(null, { status: 304, headers: { ETag: etag } });
  }

  return NextResponse.json(JSON.parse(body), {
    status: 200,
    headers: { ETag: etag },
    ...init,
  });
}

export function jsonFail(code: string, message: string, status = 400) {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}

function sanitizeZodMessage(message: string): string {
  if (/email/i.test(message) && /regex|pattern|invalid_string/i.test(message)) return 'Invalid email format';
  if (/password/i.test(message) && /min|max|length|char|special|digit|letter/i.test(message)) return 'Password must meet security requirements';
  if (/url/i.test(message) && /regex|pattern|invalid_string/i.test(message)) return 'Invalid URL format';
  return message;
}

export function mapServiceError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    const sanitized = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: sanitizeZodMessage(issue.message),
    }));
    return jsonFail('VALIDATION_ERROR', sanitized[0]?.message ?? 'Invalid input.', 422);
  }
  if (error instanceof Error) {
    const csrfCodes = ['CSRF_TOKEN_MISSING', 'CSRF_TOKEN_MALFORMED', 'CSRF_TOKEN_INVALID', 'CSRF_TOKEN_EXPIRED', 'CSRF_ORIGIN_MISMATCH'];
    const code = (error as { code?: string }).code;
    if (csrfCodes.includes(code)) return jsonFail(code, error.message, 403);

    // Prisma error codes — checked before generic code keys so they take priority
    if (code === 'P2002') return jsonFail('CONFLICT', error.message, 409);
    if (code === 'P2025') return jsonFail('NOT_FOUND', error.message, 404);
    if (code === 'P2003') return jsonFail('CONFLICT', error.message, 409);
    if (code === 'P2014') return jsonFail('CONFLICT', error.message, 409);

    if (code === 'SESSION_REQUIRED') return jsonFail('SESSION_REQUIRED', error.message, 401);
    if (code === 'FORBIDDEN') return jsonFail('FORBIDDEN', error.message, 403);
    if (code === 'NOT_FOUND') return jsonFail('NOT_FOUND', error.message, 404);
    if (code === 'CONFLICT') return jsonFail('CONFLICT', error.message, 409);
    if (code === 'VALIDATION_ERROR') return jsonFail('VALIDATION_ERROR', error.message, 422);
    if (code === 'RATE_LIMITED') return jsonFail('RATE_LIMITED', error.message, 429);
  }
  console.error('[mapServiceError] unhandled error:', error);
  return jsonFail('INTERNAL_SERVER_ERROR', 'An unexpected error occurred.', 500);
}
