import { NextResponse, type NextRequest } from 'next/server';
import { jsonFail } from '@/lib/api-response';
import { serializeSessionClearCookie, serializeSessionCookie } from './session-cookie';
import { ZodError } from 'zod';

export function requestAuthMeta(request: NextRequest) {
  return {
    ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip'),
    userAgent: request.headers.get('user-agent'),
  };
}

export function authJson<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function authError(error: unknown, fallbackStatus = 400) {
  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? 'Invalid input.';
    if (/email/i.test(message) && /regex|pattern|invalid_string/i.test(message)) return jsonFail('validation_error', 'Invalid email format', 422);
    if (/password/i.test(message) && /min|max|length|char|special|digit|letter/i.test(message)) return jsonFail('validation_error', 'Password must meet security requirements', 422);
    return jsonFail('validation_error', message, 422);
  }
  if (error instanceof Error) {
    const message = error.message;
    if (/too many login attempts/i.test(message)) return jsonFail('rate_limited', message, 429);
    if (/invalid email or password/i.test(message)) return jsonFail('invalid_credentials', message, 401);
    if (/authentication required/i.test(message)) return jsonFail('unauthorized', message, 401);
    if (/permission denied/i.test(message)) return jsonFail('permission_denied', message, 403);
    if (/too many signup attempts/i.test(message)) return jsonFail('rate_limited', message, 429);
    if (/email not verified/i.test(message)) return jsonFail('email_not_verified', message, 403);
    if (/invalid or expired verification token/i.test(message)) return jsonFail('invalid_token', message, 400);
    if (/current password is incorrect/i.test(message)) return jsonFail('invalid_credentials', message, 401);
    return jsonFail('auth_error', message, fallbackStatus);
  }
  return jsonFail('auth_error', 'Authentication request failed.', fallbackStatus);
}

export function attachSessionCookie(response: NextResponse, sessionToken: string) {
  response.headers.append('Set-Cookie', serializeSessionCookie(sessionToken));
  return response;
}

export function attachClearSessionCookie(response: NextResponse) {
  response.headers.append('Set-Cookie', serializeSessionClearCookie());
  return response;
}
