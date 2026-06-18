import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface IdempotencyCheckResult {
  isDuplicate: boolean;
  status?: number;
  body?: unknown;
  /** Set to true for callers — signals the new request should proceed */
  shouldProcess: boolean;
}

/**
 * Check and optionally store an idempotency key result.
 *
 * Usage in mutation handlers:
 * ```ts
 * const idemp = await checkIdempotency(request, session);
 * if (!idemp.shouldProcess) {
 *   return Response.json(idemp.body, { status: idemp.status });
 * }
 * // ... do the mutation ...
 * await storeIdempotency(request, session, 200, resultBody);
 * ```
 */
export async function checkIdempotency(
  request: Request,
  session: { userId: string; organizationId: string },
): Promise<IdempotencyCheckResult> {
  const key = request.headers.get('X-Idempotency-Key');
  if (!key) {
    // No idempotency key → proceed normally
    return { isDuplicate: false, shouldProcess: true };
  }

  const existing = await prisma.idempotencyKey.findUnique({
    where: { idempotencyKey: key },
  });

  if (existing) {
    return {
      isDuplicate: true,
      status: existing.resultStatus,
      body: existing.resultBody,
      shouldProcess: false,
    };
  }

  // Not found — let the caller process. They must call storeIdempotency after.
  return { isDuplicate: false, shouldProcess: true };
}

/**
 * Store the result of an idempotent mutation for 24-hour replay protection.
 */
export async function storeIdempotency(
  request: Request,
  session: { userId: string; organizationId: string },
  resultStatus: number,
  resultBody: unknown,
): Promise<void> {
  const key = request.headers.get('X-Idempotency-Key');
  if (!key) return;

  const url = new URL(request.url);

  await prisma.idempotencyKey.create({
    data: {
      idempotencyKey: key,
      organizationId: session.organizationId,
      userId: session.userId,
      method: request.method,
      path: url.pathname,
      resultStatus,
      resultBody: resultBody as Prisma.InputJsonValue,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
}

/**
 * Purge expired idempotency keys (call from a scheduled job or periodically).
 */
export async function purgeExpiredIdempotencyKeys(): Promise<number> {
  const result = await prisma.idempotencyKey.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}
