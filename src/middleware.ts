import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_PROTECTED_PREFIXES, SESSION_COOKIE_NAME } from '@/domain/auth-constants';
import { applySecurityHeaders } from '@/lib/security-headers';

const BLOCKED_METHODS = ['TRACE', 'CONNECT', 'TRACK'];
const MAX_CONCURRENT_PER_IP = 100;
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * Sliding-window per-IP request tracker with TTL eviction.
 * Prevents slowloris attacks by capping recent requests per IP.
 * Uses timestamps instead of an increment counter so entries self-clean.
 */
const recentRequests = new Map<string, number[]>();

function trimRecentRequests(ip: string, now: number): number[] {
  const timestamps = recentRequests.get(ip);
  if (!timestamps) return [];
  const cutoff = now - REQUEST_TIMEOUT_MS;
  const active = timestamps.filter((t) => t > cutoff);
  if (active.length === 0) {
    recentRequests.delete(ip);
    return [];
  }
  if (active.length !== timestamps.length) {
    recentRequests.set(ip, active);
  }
  return active;
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-real-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown';
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const clientIp = getClientIp(request);

  // Slowloris defense: sliding-window concurrency per IP
  const now = Date.now();
  const active = trimRecentRequests(clientIp, now);
  if (active.length >= MAX_CONCURRENT_PER_IP) {
    const response = new NextResponse(null, {
      status: 429,
      headers: { 'Retry-After': '30', 'X-Request-Timeout': String(REQUEST_TIMEOUT_MS) },
    });
    applySecurityHeaders(response.headers, process.env.NODE_ENV === 'production' ? 'production' : 'development');
    return response;
  }
  active.push(now);
  recentRequests.set(clientIp, active);

  // Periodic cleanup of stale IP entries across all keys
  if (recentRequests.size > MAX_CONCURRENT_PER_IP * 10) {
    const cutoff = now - REQUEST_TIMEOUT_MS;
    for (const [ip, timestamps] of recentRequests) {
      const filtered = timestamps.filter((t) => t > cutoff);
      if (filtered.length === 0) recentRequests.delete(ip);
      else if (filtered.length !== timestamps.length) recentRequests.set(ip, filtered);
    }
  }

  // P4-02: Block non-standard methods — return 405 before any processing
  if (BLOCKED_METHODS.includes(request.method.toUpperCase())) {
    const response = new NextResponse(null, {
      status: 405,
      headers: {
        Allow: 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
      },
    });
    applySecurityHeaders(response.headers, process.env.NODE_ENV === 'production' ? 'production' : 'development');
    return response;
  }

  const isProtected = AUTH_PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!isProtected) {
    const response = NextResponse.next();
    applySecurityHeaders(response.headers, process.env.NODE_ENV === 'production' ? 'production' : 'development');
    return response;
  }

  const hasSessionCookie = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  const hasDemoSessionHeaders = Boolean(request.headers.get('x-demo-user-id') && request.headers.get('x-demo-organization-id') && request.headers.get('x-demo-role'));

  if (hasSessionCookie || hasDemoSessionHeaders) {
    const response = NextResponse.next();
    applySecurityHeaders(response.headers, process.env.NODE_ENV === 'production' ? 'production' : 'development');
    return response;
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.searchParams.set('next', pathname);
  const response = NextResponse.redirect(loginUrl);
  applySecurityHeaders(response.headers, process.env.NODE_ENV === 'production' ? 'production' : 'development');
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/client/:path*', '/agency/:path*'],
};
