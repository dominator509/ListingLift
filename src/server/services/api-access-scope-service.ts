import { assertApiScopeAllowed, evaluateApiPlanGate, normalizeApiScopes, type ApiAccessScope } from '@/domain/api-access';

export type ApiTokenScopeContext = {
  organizationId: string;
  tokenId?: string | null;
  clientId?: string | null;
  agencyWorkspaceId?: string | null;
  scopes: string[];
  planKey?: string | null;
  status?: string | null;
};

export function assertApiTokenScope(context: ApiTokenScopeContext, requiredScope: ApiAccessScope) {
  assertApiScopeAllowed(context.scopes, requiredScope);
  const gate = evaluateApiPlanGate({ planKey: context.planKey, requestedScopes: [requiredScope], tokenStatus: context.status ?? 'ACTIVE' });
  if (!gate.allowed) throw new Error(`API plan gate denied: ${gate.reasons.join(' ')}`);
  return true;
}

export function buildApiScopeCheckResult(context: ApiTokenScopeContext, requiredScope: ApiAccessScope) {
  const scopes = normalizeApiScopes(context.scopes);
  const hasScope = scopes.includes(requiredScope);
  const gate = evaluateApiPlanGate({ planKey: context.planKey, requestedScopes: [requiredScope], tokenStatus: context.status ?? 'ACTIVE' });
  return {
    organizationId: context.organizationId,
    tokenId: context.tokenId ?? null,
    requiredScope,
    normalizedScopes: scopes,
    hasScope,
    planGateAllowed: gate.allowed,
    allowed: hasScope && gate.allowed,
    reasons: [...(hasScope ? [] : [`Token does not include scope ${requiredScope}.`]), ...gate.reasons],
  };
}
