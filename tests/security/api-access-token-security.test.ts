import { describe, expect, it } from 'vitest';
import { assertApiTokenScope, buildApiScopeCheckResult } from '@/server/services/api-access-scope-service';
import { issueApiTokenDraft } from '@/server/services/api-access-token-service';

const context = { organizationId: 'org_1', tokenId: 'tok_1', scopes: ['jobs:create', 'jobs:read'], planKey: 'AGENCY', status: 'ACTIVE' };

describe('api access token security', () => {
  it('enforces scopes and plan gates', () => {
    expect(assertApiTokenScope(context, 'jobs:create')).toBe(true);
    expect(() => assertApiTokenScope(context, 'webhooks:manage')).toThrow(/scope denied/);
    const result = buildApiScopeCheckResult({ ...context, planKey: 'FREE' }, 'jobs:create');
    expect(result.allowed).toBe(false);
  });

  it('does not include raw token in the persistence record draft', () => {
    const issued = issueApiTokenDraft({ organizationId: 'org_1', label: 'Scoped token', scopes: ['jobs:read'], planKey: 'AGENCY', showOnceAcknowledged: true });
    expect(JSON.stringify(issued.record)).not.toContain(issued.token);
    expect(issued.record.metadata.rawTokenStored).toBe(false);
  });
});
