import { AGENCY_WHITE_LABEL_SAFE_COPY } from '@/domain/agency-white-label';
import type { AgencyWhiteLabelEventInput } from '@/schemas/agency-white-label';

export function buildAgencyWhiteLabelEventDraft(input: AgencyWhiteLabelEventInput & { userId?: string | null }) {
  return {
    organizationId: input.organizationId ?? 'runtime-session-organization',
    userId: input.userId ?? null,
    clientId: input.clientId ?? null,
    workspaceId: input.workspaceId ?? null,
    jobId: input.jobId ?? null,
    section: input.section,
    eventType: input.eventType,
    metadata: input.metadata ?? {},
    auditRequired: true,
    privacyNotice: AGENCY_WHITE_LABEL_SAFE_COPY.reportsNotice,
    dryRun: true,
  };
}
