import { ADMIN_ANALYTICS_SAFE_COPY } from '@/domain/admin-dashboard-analytics';
import type { AdminDashboardEventInput } from '@/schemas/admin-dashboard-analytics';

export function buildAdminDashboardEventDraft(input: AdminDashboardEventInput & { userId?: string | null }) {
  return {
    organizationId: input.organizationId ?? 'runtime-session-organization',
    userId: input.userId ?? null,
    clientId: input.clientId ?? null,
    jobId: input.jobId ?? null,
    section: input.section,
    eventType: input.eventType,
    sourceChannel: input.sourceChannel ?? null,
    metadata: input.metadata ?? {},
    auditRequired: true,
    privacyNotice: ADMIN_ANALYTICS_SAFE_COPY.privacyNotice,
    dryRun: true,
  };
}
