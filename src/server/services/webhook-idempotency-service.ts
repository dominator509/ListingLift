import { prisma } from '@/lib/prisma';
import type { Prisma, WebhookEventStatus } from '@prisma/client';

export type IdempotencyResult =
  | { duplicate: true; existingId: string }
  | { duplicate: false; webhookEventId: string };

/**
 * Record a webhook event with idempotency guarantee.
 * Uses the @@unique([provider, externalId]) constraint on WebhookEvent.
 * If a row already exists with the same (provider, externalId), returns
 * { duplicate: true } so the caller can return 200 without re-processing.
 */
export async function recordWebhookEvent(
  provider: string,
  externalId: string,
  eventType: string,
  payload: Record<string, unknown>,
  signatureVerified: boolean,
  organizationId?: string,
): Promise<IdempotencyResult> {
  try {
    const event = await prisma.webhookEvent.create({
      data: {
        provider,
        externalId,
        eventType,
        payload: payload as Prisma.InputJsonValue,
        signatureVerified,
        status: signatureVerified ? 'VERIFIED' : 'RECEIVED',
        organizationId: organizationId ?? null,
      },
    });
    return { duplicate: false, webhookEventId: event.id };
  } catch (err: unknown) {
    // P2002 = unique constraint violation → duplicate event
    if (isPrismaP2002(err)) {
      const existing = await prisma.webhookEvent.findFirst({
        where: { provider, externalId },
        select: { id: true },
      });
      return { duplicate: true, existingId: existing?.id ?? 'unknown' };
    }
    throw err;
  }
}

function isPrismaP2002(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: unknown }).code === 'P2002';
}

/**
 * Update the processing status of a webhook event after processing completes.
 */
export async function markWebhookProcessed(
  id: string,
  status: WebhookEventStatus,
  error?: string,
) {
  return prisma.webhookEvent.update({
    where: { id },
    data: {
      status,
      processedAt: new Date(),
      error: error ?? null,
    },
  });
}
