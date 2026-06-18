import { NextResponse } from 'next/server';
import { resetRateLimiter } from '@/lib/rate-limiter';

/**
 * POST /api/test/reset-rate-limiter — resets all rate limit buckets.
 * Only available in non-production environments.
 */
export async function POST() {
  resetRateLimiter();
  return NextResponse.json({ ok: true, data: { message: 'Rate limiter reset' } });
}
