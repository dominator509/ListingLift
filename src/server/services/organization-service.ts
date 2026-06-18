import { organizationSchema, type OrganizationInput } from '@/schemas/organization';
import { type SessionContext } from '@/schemas/auth';
import { assertPermission } from '@/server/services/authorization-service';

export function validateOrganizationInput(input: OrganizationInput) {
  return organizationSchema.parse(input);
}

export function assertCanManageOrganization(actor: SessionContext, targetOrganizationId: string) {
  if (actor.role === 'SUPER_ADMIN') return;
  assertPermission(actor, 'manage:team');
  if (actor.organizationId !== targetOrganizationId) {
    throw new Error('Tenant isolation violation: cannot manage another organization.');
  }
}

export function buildOrganizationWhereForSession(session: SessionContext) {
  if (session.role === 'SUPER_ADMIN') return {};
  return { id: session.organizationId };
}

export function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}
