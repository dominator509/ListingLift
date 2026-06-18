import { PERMISSIONS, type PermissionKey } from '@/domain/permissions';
import type { SessionContext } from '@/schemas/auth';
import { assertPermission, can } from '@/server/services/authorization-service';

export type AgencyScopedResource = {
  organizationId?: string | null;
  clientId?: string | null;
};

export function canAccessAgencyWhiteLabel(session: SessionContext) {
  if (session.role === 'SUPER_ADMIN') return true;
  if (session.role === 'AGENCY_ADMIN' && (session.agencyScope || session.organizationType === 'AGENCY')) return true;
  return session.organizationType === 'AGENCY' && can(session, PERMISSIONS.manageClients);
}

export function assertAgencyWhiteLabelAccess(session: SessionContext, resource: AgencyScopedResource = {}) {
  if (!canAccessAgencyWhiteLabel(session)) {
    throw new Error('Permission denied: agency white-label access required.');
  }
  if (session.role !== 'SUPER_ADMIN' && resource.organizationId && resource.organizationId !== session.organizationId) {
    throw new Error('Permission denied: agency tenant scope mismatch.');
  }
  if (session.clientId && resource.clientId && session.clientId !== resource.clientId) {
    throw new Error('Permission denied: agency client scope mismatch.');
  }
  return true;
}

export function assertAgencyWhiteLabelPermission(session: SessionContext, permission: PermissionKey, resource: AgencyScopedResource = {}) {
  assertAgencyWhiteLabelAccess(session, resource);
  assertPermission(session, permission);
  return true;
}

export function assertCanManageAgencyWorkspaces(session: SessionContext, resource: AgencyScopedResource = {}) {
  return assertAgencyWhiteLabelPermission(session, PERMISSIONS.manageClients, resource);
}

export function assertCanManageAgencyBranding(session: SessionContext, resource: AgencyScopedResource = {}) {
  return assertAgencyWhiteLabelPermission(session, PERMISSIONS.manageAgencyBranding, resource);
}

export function assertCanManageAgencyTeam(session: SessionContext, resource: AgencyScopedResource = {}) {
  return assertAgencyWhiteLabelPermission(session, PERMISSIONS.manageTeam, resource);
}

export function assertCanManageAgencyBilling(session: SessionContext, resource: AgencyScopedResource = {}) {
  return assertAgencyWhiteLabelPermission(session, PERMISSIONS.manageBilling, resource);
}

export function assertCanManageAgencyQueue(session: SessionContext, resource: AgencyScopedResource = {}) {
  return assertAgencyWhiteLabelPermission(session, PERMISSIONS.manageJobs, resource);
}
