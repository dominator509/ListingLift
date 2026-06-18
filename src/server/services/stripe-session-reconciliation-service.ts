/**
 * P26: Stripe Multi-Session Reconciliation
 *
 * Detects abandoned checkout sessions — sessions created via the checkout
 * routes that never completed (no checkout.session.completed webhook received).
 *
 * Currently operates on the webhook_events table + in-memory session registry.
 * When full session persistence is wired (Prisma CheckoutSession model), this
 * service should query DB sessions directly.
 */

import { prisma } from '@/lib/prisma';

// ── In-memory session registry for sessions created before DB persistence ──
interface TrackedSession {
  clientReferenceId: string;
  packageKey: string;
  purpose: string;
  amountCents: number;
  createdAt: Date;
  completedAt: Date | null;
  expiredAt: Date | null;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'ABANDONED';
}

const sessionRegistry = new Map<string, TrackedSession>();

/**
 * Track a new checkout session. Called by checkout route handlers.
 */
export function trackCheckoutSession(input: {
  clientReferenceId: string;
  packageKey: string;
  purpose: string;
  amountCents: number;
}): void {
  sessionRegistry.set(input.clientReferenceId, {
    clientReferenceId: input.clientReferenceId,
    packageKey: input.packageKey,
    purpose: input.purpose,
    amountCents: input.amountCents,
    createdAt: new Date(),
    completedAt: null,
    expiredAt: null,
    status: 'PENDING',
  });
}

/**
 * Mark a session as completed. Called by webhook on checkout.session.completed.
 */
export function markSessionCompleted(clientReferenceId: string): void {
  const session = sessionRegistry.get(clientReferenceId);
  if (session) {
    session.status = 'COMPLETED';
    session.completedAt = new Date();
  }
}

/**
 * Mark a session as expired. Called by webhook on checkout.session.expired.
 */
export function markSessionExpired(clientReferenceId: string): void {
  const session = sessionRegistry.get(clientReferenceId);
  if (session) {
    session.status = 'EXPIRED';
    session.expiredAt = new Date();
  }
}

/**
 * Reconcile all tracked sessions against webhook event history.
 * Returns abandoned session IDs for operator visibility.
 */
export async function reconcileStripeSessions(): Promise<{
  total: number;
  completed: number;
  expired: number;
  pending: number;
  abandoned: number;
  abandonedSessions: { clientReferenceId: string; purpose: string; packageKey: string; createdAt: Date }[];
}> {
  const now = Date.now();
  const oneHourMs = 60 * 60 * 1000;
  const abandoned: { clientReferenceId: string; purpose: string; packageKey: string; createdAt: Date }[] = [];

  for (const [, session] of sessionRegistry) {
    if (session.status !== 'PENDING') continue;

    // Check if a completed webhook event arrived for this session
    try {
      const webhookEvent = await prisma.webhookEvent.findFirst({
        where: {
          provider: 'stripe',
          eventType: 'checkout.session.completed',
          payload: { path: ['data', 'object', 'client_reference_id'], equals: session.clientReferenceId },
        },
        select: { id: true },
      });

      if (webhookEvent) {
        session.status = 'COMPLETED';
        session.completedAt = new Date();
        continue;
      }
    } catch {
      // Prisma filter may not support JSON path queries in all adapters — fall through
    }

    // Check for expired webhook events
    try {
      const expiredEvent = await prisma.webhookEvent.findFirst({
        where: {
          provider: 'stripe',
          eventType: 'checkout.session.expired',
          payload: { path: ['data', 'object', 'client_reference_id'], equals: session.clientReferenceId },
        },
        select: { id: true },
      });

      if (expiredEvent) {
        session.status = 'EXPIRED';
        session.expiredAt = new Date();
        continue;
      }
    } catch {
      // Fall through
    }

    // If older than 1 hour and still pending, mark as abandoned
    if (now - session.createdAt.getTime() > oneHourMs) {
      session.status = 'ABANDONED';
      abandoned.push({
        clientReferenceId: session.clientReferenceId,
        purpose: session.purpose,
        packageKey: session.packageKey,
        createdAt: session.createdAt,
      });
    }
  }

  const completed = [...sessionRegistry.values()].filter(s => s.status === 'COMPLETED').length;
  const expired = [...sessionRegistry.values()].filter(s => s.status === 'EXPIRED').length;
  const pending = [...sessionRegistry.values()].filter(s => s.status === 'PENDING').length;

  if (abandoned.length > 0) {
    console.log(JSON.stringify({
      event: 'stripe_session_reconciliation',
      action: 'abandoned_sessions_found',
      count: abandoned.length,
      sessions: abandoned.map(s => ({
        clientReferenceId: s.clientReferenceId,
        purpose: s.purpose,
        packageKey: s.packageKey,
        createdAgo: Math.round((now - s.createdAt.getTime()) / 60000) + 'm',
      })),
    }));
  }

  return {
    total: sessionRegistry.size,
    completed,
    expired,
    pending,
    abandoned: abandoned.length,
    abandonedSessions: abandoned,
  };
}

/**
 * Get a summary of all tracked sessions.
 */
export function getSessionSummary(): {
  total: number;
  completed: number;
  expired: number;
  pending: number;
  abandoned: number;
} {
  const completed = [...sessionRegistry.values()].filter(s => s.status === 'COMPLETED').length;
  const expired = [...sessionRegistry.values()].filter(s => s.status === 'EXPIRED').length;
  const pending = [...sessionRegistry.values()].filter(s => s.status === 'PENDING').length;
  const abandoned = [...sessionRegistry.values()].filter(s => s.status === 'ABANDONED').length;

  return { total: sessionRegistry.size, completed, expired, pending, abandoned };
}

/**
 * Auto-expire orphan sessions that have been pending for more than the given TTL.
 * Returns count of sessions auto-expired.
 */
export function autoExpireOrphanSessions(ttlMs: number = 60 * 60 * 1000): number {
  const now = Date.now();
  let expired = 0;

  for (const [, session] of sessionRegistry) {
    if (session.status === 'PENDING' && now - session.createdAt.getTime() > ttlMs) {
      session.status = 'EXPIRED';
      session.expiredAt = new Date();
      expired++;
    }
  }

  if (expired > 0) {
    console.log(JSON.stringify({
      event: 'stripe_session_auto_expire',
      count: expired,
      ttlMs,
    }));
  }

  return expired;
}
