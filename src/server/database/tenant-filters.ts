export type TenantScopedWhere = {
  organizationId: string;
  deletedAt?: null;
};

export function tenantWhere(organizationId: string): TenantScopedWhere {
  if (!organizationId) {
    throw new Error('organizationId is required for tenant scoped queries');
  }
  return { organizationId, deletedAt: null };
}

export function tenantWhereIncludingDeleted(organizationId: string): Pick<TenantScopedWhere, 'organizationId'> {
  if (!organizationId) {
    throw new Error('organizationId is required for tenant scoped queries');
  }
  return { organizationId };
}

export function assertSameTenant(recordOrganizationId: string | null | undefined, expectedOrganizationId: string): void {
  if (!recordOrganizationId || recordOrganizationId !== expectedOrganizationId) {
    throw new Error('Tenant isolation violation: record does not belong to the active organization');
  }
}
