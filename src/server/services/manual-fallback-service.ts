import { requiresAudit, type ManualFallbackAction } from '@/domain/manual-fallbacks';
import { recordAuditLog } from '@/server/services/audit-log-service';

export async function recordManualFallback(input: {
  organizationId: string;
  actorUserId?: string | null;
  jobId?: string | null;
  action: ManualFallbackAction;
  reason: string;
}) {
  if (requiresAudit(input.action)) {
    await recordAuditLog({
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      jobId: input.jobId,
      action: 'job.manual_override',
      targetType: 'manual_fallback',
      targetId: input.jobId,
      metadata: { fallbackAction: input.action, reason: input.reason },
    });
  }
  return { ...input, recordedAt: new Date().toISOString() };
}
