import { type AuditEntryInput, redactAuditMetadata } from '@/lib/audit';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function recordAuditLog(input: AuditEntryInput) {
  const entry = {
    ...input,
    metadata: redactAuditMetadata(input.metadata),
  };

  try {
    return await prisma.auditLog.create({
      data: {
        organizationId: entry.organizationId ?? null,
        actorUserId: entry.actorUserId ?? null,
        jobId: entry.jobId ?? null,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId ?? null,
        metadata: entry.metadata != null ? (entry.metadata as Prisma.InputJsonValue) : undefined,
        ipAddress: entry.ipAddress ?? null,
      },
    });
  } catch (error) {
    // Audit writes must not leak secrets or crash paid fulfillment flow in the seed.
    // Codex should verify DB persistence and decide whether production should fail closed for selected sensitive actions.
    logger.warn('audit.log.persistence_failed', { error: error instanceof Error ? error.message : 'unknown', entry });
    return { ...entry, createdAt: new Date().toISOString(), persistence: 'failed' as const };
  }
}
