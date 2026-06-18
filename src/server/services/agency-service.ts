import { canUseWhiteLabelMode, formatAgencyClientLabel, type AgencyClientSummary } from '@/domain/agency';
import { agencyBrandSettingsSchema, agencyClientFilterSchema, type AgencyBrandSettingsInput, type AgencyClientFilterInput } from '@/schemas/agency';
import { type SessionContext } from '@/schemas/auth';
import { assertPermission } from '@/server/services/authorization-service';
import { buildClientWhereForSession } from '@/server/services/client-access-service';

export function validateAgencyBrandSettings(input: AgencyBrandSettingsInput) {
  return agencyBrandSettingsSchema.parse(input);
}

export function validateAgencyClientFilter(input: AgencyClientFilterInput) {
  return agencyClientFilterSchema.parse(input);
}

export function assertAgencyWorkspaceAccess(session: SessionContext) {
  if (!canUseWhiteLabelMode({ role: session.role, organizationType: session.organizationType })) {
    throw new Error('Permission denied: agency workspace access required.');
  }
}

export function assertCanManageAgencyBranding(session: SessionContext) {
  assertAgencyWorkspaceAccess(session);
  assertPermission(session, 'manage:agency-branding');
}

export function buildAgencyClientWhere(session: SessionContext, input: AgencyClientFilterInput = {}) {
  assertAgencyWorkspaceAccess(session);
  const filter = validateAgencyClientFilter(input);
  return {
    ...buildClientWhereForSession(session),
    ...(filter.status ? { status: filter.status } : {}),
    ...(filter.search
      ? {
          OR: [
            { name: { contains: filter.search, mode: 'insensitive' as const } },
            { businessName: { contains: filter.search, mode: 'insensitive' as const } },
            { email: { contains: filter.search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };
}

export function summarizeAgencyClient(client: AgencyClientSummary) {
  return {
    id: client.id,
    label: formatAgencyClientLabel(client),
    status: client.status,
    assignedAdminUserId: client.assignedAdminUserId ?? null,
  };
}
