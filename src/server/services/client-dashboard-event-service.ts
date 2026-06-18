import type { ClientDashboardEventInput } from '@/schemas/client-dashboard';

export function buildClientDashboardEventDraft(input: ClientDashboardEventInput, context: { organizationId: string; userId?: string | null }) {
  return {
    organizationId: context.organizationId,
    clientId: input.clientId ?? null,
    userId: context.userId ?? null,
    section: input.section,
    eventType: input.eventType,
    jobId: input.jobId ?? null,
    metadata: input.metadata ?? {},
    auditRequired: ['OPEN_DOWNLOAD', 'OPEN_UPLOAD', 'OPEN_REVISION', 'REQUEST_HELP'].includes(input.eventType),
  };
}
