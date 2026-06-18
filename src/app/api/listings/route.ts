import { NextRequest } from 'next/server';
import { jsonOk, mapServiceError } from '@/lib/api-response';
import { checkRateLimit } from '@/lib/rate-limiter';
import { callWithCircuitBreaker, CircuitOpenError } from '@/lib/circuit-breaker';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/listings — test endpoint returning basic listing counts.
 * Used for load and resilience testing.
 */
export async function GET(request: NextRequest) {
  const start = Date.now();

  // Rate limit check per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const rl = checkRateLimit(`listings:${ip}`, 60_000, 60);
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ ok: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please slow down.' } }),
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)), 'X-RateLimit-Remaining': '0' } }
    );
  }

  try {
    // Circuit breaker around the DB query
    const result = await callWithCircuitBreaker('listings-db', async () => {
      const count = await prisma.job.count();
      const recent = await prisma.job.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, status: true, createdAt: true },
      });
      return { totalJobs: count, recentJobs: recent };
    });

    const elapsed = Date.now() - start;
    return jsonOk({ ...result, elapsedMs: elapsed });
  } catch (error) {
    if (error instanceof CircuitOpenError) {
      return new Response(
        JSON.stringify({ ok: false, error: { code: 'SERVICE_UNAVAILABLE', message: 'Service temporarily unavailable. Please retry later.' } }),
        { status: 503, headers: { 'Retry-After': String(Math.ceil(error.retryAfterMs / 1000)) } }
      );
    }
    return mapServiceError(error);
  }
}
