import { PERMISSIONS, ROLE_PERMISSIONS, type PermissionKey, type RoleKey } from './permissions';

export type RoleDefinition = {
  key: RoleKey;
  name: string;
  description: string;
  permissions: PermissionKey[];
};

export const DEFAULT_ROLES: RoleDefinition[] = [
  { key: 'SUPER_ADMIN', name: 'Super Admin', description: 'Full platform administration across organizations.', permissions: ROLE_PERMISSIONS.SUPER_ADMIN },
  { key: 'OPERATOR', name: 'Operator', description: 'Internal operator managing clients, jobs, packages, presets, and delivery.', permissions: ROLE_PERMISSIONS.OPERATOR },
  { key: 'AGENCY_ADMIN', name: 'Agency Admin', description: 'Agency workspace admin with client, team, billing, and branding access.', permissions: ROLE_PERMISSIONS.AGENCY_ADMIN },
  { key: 'CLIENT_OWNER', name: 'Client Owner', description: 'Client-side account owner who can upload, revise, download, and manage billing.', permissions: ROLE_PERMISSIONS.CLIENT_OWNER },
  { key: 'CLIENT_VIEWER', name: 'Client Viewer', description: 'Read-only client user for dashboard and downloads.', permissions: ROLE_PERMISSIONS.CLIENT_VIEWER },
  { key: 'FULFILLMENT_REVIEWER', name: 'Fulfillment Reviewer', description: 'Reviewer for outputs, flags, and fulfillment quality checks.', permissions: ROLE_PERMISSIONS.FULFILLMENT_REVIEWER },
  { key: 'DESIGNER_EDITOR', name: 'Designer / Editor', description: 'Designer/editor who can upload replacements and review outputs without final delivery control.', permissions: ROLE_PERMISSIONS.DESIGNER_EDITOR },
  { key: 'BILLING_MANAGER', name: 'Billing Manager', description: 'Billing and credit-ledger manager.', permissions: ROLE_PERMISSIONS.BILLING_MANAGER },
];

export const DEFAULT_PERMISSIONS = Object.entries(PERMISSIONS).map(([name, key]) => ({
  name,
  key,
  description: `Allows ${key.replace(':', ' ')} actions when tenant scope also permits access.`,
}));
