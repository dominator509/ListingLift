import { API_SCOPE_DESCRIPTIONS, API_PLAN_SCOPE_ALLOWLIST, evaluateApiPlanGate, normalizeApiPlanKey, type ApiAccessScope, type ApiPlanGateInput, type ApiPlanKey } from '@/domain/api-access';
import { apiPlanGateRequestSchema, type ApiPlanGateRequest } from '@/schemas/api-access';

export function buildApiPlanGateDecision(input: ApiPlanGateRequest | ApiPlanGateInput) {
  const parsed = apiPlanGateRequestSchema.parse(input);
  return evaluateApiPlanGate({
    planKey: parsed.planKey,
    requestedScopes: parsed.requestedScopes,
    tokenStatus: parsed.tokenStatus ?? 'ACTIVE',
    subscriptionStatus: parsed.subscriptionStatus ?? 'ACTIVE',
    paymentStatus: parsed.paymentStatus ?? 'PAID',
  });
}

export function getApiScopeMatrix(planKey: string = 'AGENCY') {
  const normalized = normalizeApiPlanKey(planKey);
  const allowed = API_PLAN_SCOPE_ALLOWLIST[normalized];
  return Object.entries(API_SCOPE_DESCRIPTIONS).map(([scope, definition]) => ({
    scope: scope as ApiAccessScope,
    ...definition,
    allowedForPlan: allowed.includes(scope as ApiAccessScope),
    currentPlan: normalized as ApiPlanKey,
  }));
}

export function assertApiPlanAllowsScopes(planKey: string, requestedScopes: string[]) {
  const decision = evaluateApiPlanGate({ planKey, requestedScopes });
  if (!decision.allowed) throw new Error(`API plan denied: ${decision.reasons.join(' ')}`);
  return true;
}
