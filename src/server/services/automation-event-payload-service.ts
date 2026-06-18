import { buildAutomationDedupeKey, redactAutomationPayload, type AutomationActionKey, type AutomationTriggerKey } from '@/domain/automation-webhooks';

export type AutomationEventPayloadInput = {
  organizationId: string;
  triggerKey: AutomationTriggerKey;
  actionKey: AutomationActionKey;
  jobId?: string;
  clientId?: string;
  externalOrderId?: string;
  sourceId?: string;
  payload?: Record<string, unknown>;
};

export function buildAutomationEventPayload(input: AutomationEventPayloadInput) {
  const dedupeKey = buildAutomationDedupeKey(input);
  const payload = redactAutomationPayload({
    organizationId: input.organizationId,
    triggerKey: input.triggerKey,
    actionKey: input.actionKey,
    jobId: input.jobId,
    clientId: input.clientId,
    externalOrderId: input.externalOrderId,
    sourceId: input.sourceId,
    ...(input.payload ?? {}),
  });
  return {
    dedupeKey,
    payload,
    headers: {
      'x-listinglift-trigger': input.triggerKey,
      'x-listinglift-action': input.actionKey,
      'x-listinglift-dedupe-key': dedupeKey,
    },
  };
}

export function stripUnsafeAutomationPayloadKeys(payload: Record<string, unknown>) {
  const allowed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    const lower = key.toLowerCase();
    if (lower.includes('password') || lower.includes('secret') || lower.includes('token') || lower.includes('signedurl') || lower.includes('rawfile') || lower.includes('filebytes')) continue;
    allowed[key] = value;
  }
  return allowed;
}
