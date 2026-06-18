import { getAutomationProvider, requiresAutomationManualFallback } from '@/domain/automation-webhooks';
import { automationDispatchInputSchema, type AutomationDispatchInput } from '@/schemas/automation-webhooks';
import { getAutomationWebhookAdapter } from '@/server/adapters/automation-webhook/registry';
import { buildAutomationEventPayload, stripUnsafeAutomationPayloadKeys } from './automation-event-payload-service';
import { evaluateAutomationProviderReadiness, ensureActionSupported } from './automation-webhook-policy-service';

export async function planAutomationDispatch(input: AutomationDispatchInput) {
  const parsed = automationDispatchInputSchema.parse(input);
  const provider = getAutomationProvider(parsed.providerKey);
  const readiness = evaluateAutomationProviderReadiness({ providerKey: parsed.providerKey, realIntegrationsEnabled: false, providerEnabled: parsed.providerKey === 'internal_mock' });
  const action = ensureActionSupported({ providerKey: parsed.providerKey, actionKey: parsed.actionKey });
  const safePayload = stripUnsafeAutomationPayloadKeys(parsed.payload);
  const event = buildAutomationEventPayload({ ...parsed, payload: safePayload });
  return {
    provider,
    readiness,
    action,
    event,
    status: readiness.ready && action.allowed ? 'QUEUED' : 'SKIPPED',
    manualFallbackRequired: !readiness.ready || !action.allowed,
    auditAction: 'automation.dispatch.plan',
  };
}

export async function dispatchAutomationWebhook(input: AutomationDispatchInput) {
  const parsed = automationDispatchInputSchema.parse(input);
  const planned = await planAutomationDispatch(parsed);
  if (planned.status === 'SKIPPED') {
    return { ...planned, dispatchResult: { status: 'SKIPPED', message: 'Dispatch skipped by readiness or action policy.' } };
  }
  const adapter = getAutomationWebhookAdapter(parsed.providerKey);
  const result = await adapter.dispatch({
    organizationId: parsed.organizationId,
    providerKey: parsed.providerKey,
    triggerKey: parsed.triggerKey,
    actionKey: parsed.actionKey,
    payload: planned.event.payload,
    dryRun: parsed.dryRun,
  });
  return {
    ...planned,
    dispatchResult: result,
    manualFallbackRequired: requiresAutomationManualFallback(result.status),
    auditAction: 'automation.dispatch.attempt',
  };
}
