import { describe, expect, it } from 'vitest';
import { assertSameTenant, tenantWhere } from '../../src/server/database/tenant-filters';

describe('tenant database helper contract', () => {
  it('requires organizationId for tenant scoped queries', () => {
    expect(() => tenantWhere('')).toThrow('organizationId is required');
  });

  it('adds deletedAt null by default to avoid soft-deleted records', () => {
    expect(tenantWhere('org_123')).toEqual({ organizationId: 'org_123', deletedAt: null });
  });

  it('throws when a record belongs to another tenant', () => {
    expect(() => assertSameTenant('org_a', 'org_b')).toThrow('Tenant isolation violation');
  });
});
