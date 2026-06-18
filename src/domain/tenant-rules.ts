import { PERMISSIONS, type PermissionKey, type RoleKey } from '@/domain/permissions';

export const TENANT_SCOPED_MODELS = [
  'Client',
  'Job',
  'Image',
  'ProcessedFile',
  'ExternalOrder',
  'Report',
  'RevisionRequest',
  'DeliveryLink',
  'CreditLedger',
  'Subscription',
  'InvoicePayment',
  'IntegrationConnection',
  'AutomationEvent',
  'AuditLog',
] as const;

export type TenantScopedModel = (typeof TENANT_SCOPED_MODELS)[number];

export const CLIENT_SCOPED_ROLES: RoleKey[] = ['CLIENT_OWNER', 'CLIENT_VIEWER'];
export const AGENCY_SCOPED_ROLES: RoleKey[] = ['AGENCY_ADMIN'];
export const INTERNAL_ROLES: RoleKey[] = ['SUPER_ADMIN', 'OPERATOR', 'FULFILLMENT_REVIEWER', 'DESIGNER_EDITOR', 'BILLING_MANAGER'];

export const CLIENT_VISIBLE_PERMISSIONS: PermissionKey[] = [
  PERMISSIONS.uploadImages,
  PERMISSIONS.requestRevisions,
  PERMISSIONS.downloadFiles,
  PERMISSIONS.viewClientDashboard,
  PERMISSIONS.manageBilling,
];

export const REVENUE_PERMISSIONS: PermissionKey[] = [PERMISSIONS.viewRevenue, PERMISSIONS.manageBilling, PERMISSIONS.adjustCredits];

export function isClientScopedRole(role: RoleKey) {
  return CLIENT_SCOPED_ROLES.includes(role);
}

export function isAgencyScopedRole(role: RoleKey) {
  return AGENCY_SCOPED_ROLES.includes(role);
}

export function isInternalRole(role: RoleKey) {
  return INTERNAL_ROLES.includes(role);
}

export function requiresClientScope(role: RoleKey, permission: PermissionKey) {
  return isClientScopedRole(role) && !CLIENT_VISIBLE_PERMISSIONS.includes(permission);
}
