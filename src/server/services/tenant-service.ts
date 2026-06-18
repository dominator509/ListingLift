import { type SessionContext } from '@/schemas/auth';

export type TenantScopedInput = {
  organizationId: string;
};

export function assertSameOrganization(session: SessionContext, input: TenantScopedInput) {
  if (session.organizationId !== input.organizationId && session.role !== 'SUPER_ADMIN') {
    throw new Error('Tenant isolation violation.');
  }
}

export function scopedWhere(session: SessionContext) {
  if (session.role === 'SUPER_ADMIN') return {};
  return { organizationId: session.organizationId };
}

export function attachOrganizationScope<T extends Record<string, unknown>>(session: SessionContext, data: T) {
  return { ...data, organizationId: session.organizationId };
}


export function assertClientScope(session: SessionContext, input: { organizationId: string; clientId?: string | null }) {
  assertSameOrganization(session, { organizationId: input.organizationId });
  if (session.clientId && input.clientId && session.clientId !== input.clientId) {
    throw new Error('Client isolation violation.');
  }
}

export function clientScopedWhere(session: SessionContext) {
  if (session.role === 'SUPER_ADMIN') return {};
  if (session.clientId) return { organizationId: session.organizationId, clientId: session.clientId };
  return { organizationId: session.organizationId };
}

export function organizationScopedWhere(session: SessionContext) {
  if (session.role === 'SUPER_ADMIN') return {};
  return { id: session.organizationId };
}
