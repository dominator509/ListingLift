import { roleHasPermission } from '@/domain/rbac-matrix';
import type { PermissionKey, RoleKey } from '@/domain/permissions';

export type AdminAnalyticsSession = {
  organizationId: string;
  userId: string;
  role: RoleKey;
  clientId?: string | null;
  agencyScope?: boolean | null;
};

export type AdminAnalyticsResourceScope = {
  organizationId: string;
  clientId?: string | null;
};

const adminAnalyticsRoles: RoleKey[] = ['SUPER_ADMIN', 'OPERATOR', 'AGENCY_ADMIN', 'BILLING_MANAGER'];

export function canAccessAdminAnalytics(session: AdminAnalyticsSession, permission: PermissionKey = 'view:revenue') {
  if (!adminAnalyticsRoles.includes(session.role)) return false;
  return roleHasPermission(session.role, permission);
}

export function assertAdminDashboardAnalyticsAccess(session: AdminAnalyticsSession, resource: AdminAnalyticsResourceScope, permission: PermissionKey = 'view:revenue') {
  if (session.organizationId !== resource.organizationId) {
    throw new Error('Tenant scope mismatch for admin analytics resource.');
  }
  if (!canAccessAdminAnalytics(session, permission)) {
    throw new Error(`Permission denied for admin analytics: ${permission}`);
  }
  if ((session.role === 'CLIENT_OWNER' || session.role === 'CLIENT_VIEWER') && session.clientId) {
    throw new Error('Client-scoped users cannot access admin analytics.');
  }
  return true;
}
