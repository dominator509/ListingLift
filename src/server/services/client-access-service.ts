import { PERMISSIONS, type PermissionKey } from '@/domain/permissions';
import { type SessionContext } from '@/schemas/auth';
import { assertPermissionAndTenant, type MembershipScope, type ResourceScope } from '@/server/services/rbac-policy-service';

export type ClientResource = ResourceScope & {
  id: string;
  status?: string | null;
};

export function sessionToMembershipScope(session: SessionContext): MembershipScope {
  return {
    organizationId: session.organizationId,
    role: session.role,
    clientId: session.clientId,
    agencyScope: session.agencyScope,
  };
}

export function assertClientAccess(session: SessionContext, client: ClientResource, permission: PermissionKey = PERMISSIONS.viewClientDashboard) {
  assertPermissionAndTenant(sessionToMembershipScope(session), permission, {
    organizationId: client.organizationId,
    clientId: client.id,
  });
}

export function assertJobClientAccess(session: SessionContext, job: ResourceScope, permission: PermissionKey = PERMISSIONS.manageJobs) {
  assertPermissionAndTenant(sessionToMembershipScope(session), permission, job);
}

export function buildClientWhereForSession(session: SessionContext) {
  if (session.role === 'SUPER_ADMIN') return {};
  if (session.clientId) return { organizationId: session.organizationId, id: session.clientId };
  return { organizationId: session.organizationId };
}

export function buildJobWhereForSession(session: SessionContext) {
  if (session.role === 'SUPER_ADMIN') return {};
  if (session.clientId) return { organizationId: session.organizationId, clientId: session.clientId };
  return { organizationId: session.organizationId };
}
