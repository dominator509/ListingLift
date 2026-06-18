import { automationSubscriptionInputSchema, type AutomationSubscriptionInput } from '@/schemas/automation-webhooks';
import { evaluateAutomationProviderReadiness, ensureActionSupported } from './automation-webhook-policy-service';

export function buildAutomationSubscriptionDraft(input: AutomationSubscriptionInput) {
  const parsed = automationSubscriptionInputSchema.parse(input);
  const readiness = evaluateAutomationProviderReadiness({ providerKey: parsed.providerKey, encryptedSecretId: parsed.encryptedSecretId, realIntegrationsEnabled: false, providerEnabled: parsed.providerKey === 'internal_mock' });
  const unsupportedActions = parsed.actionKeys
    .map((actionKey) => ({ actionKey, result: ensureActionSupported({ providerKey: parsed.providerKey, actionKey }) }))
    .filter((item) => !item.result.allowed);
  return {
    ...parsed,
    status: parsed.enabled && readiness.ready && unsupportedActions.length === 0 ? 'ENABLED' : 'DRAFT',
    readinessWarnings: readiness.warnings,
    unsupportedActions: unsupportedActions.map((item) => item.actionKey),
    auditAction: 'automation.subscription.draft',
  };
}

export function planAutomationSubscriptionUpdate(input: { subscriptionId: string; enabled?: boolean; status?: string; actorUserId?: string }) {
  return {
    subscriptionId: input.subscriptionId,
    status: input.status ?? (input.enabled ? 'ENABLED' : 'PAUSED'),
    actorUserId: input.actorUserId,
    auditAction: 'automation.subscription.update',
    requiresAuditLog: true,
  };
}
