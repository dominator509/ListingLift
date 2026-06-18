import type { AutomationActionKey, AutomationTriggerKey, AutomationWebhookProviderKey } from '@/domain/automation-webhooks';

export type AutomationWebhookDispatchPayload = {
  organizationId: string;
  providerKey: AutomationWebhookProviderKey;
  triggerKey: AutomationTriggerKey;
  actionKey: AutomationActionKey;
  payload: Record<string, unknown>;
  endpointUrl?: string;
  signature?: string;
  timestamp?: string;
  dryRun?: boolean;
};

export type AutomationWebhookDispatchResult = {
  providerKey: AutomationWebhookProviderKey;
  status: 'SENT' | 'SKIPPED' | 'FAILED';
  statusCode?: number;
  externalRequestId?: string;
  message: string;
  retriable: boolean;
  manualFallbackRequired: boolean;
};

export type AutomationWebhookAdapter = {
  key: AutomationWebhookProviderKey;
  label: string;
  dispatch: (payload: AutomationWebhookDispatchPayload) => Promise<AutomationWebhookDispatchResult>;
  healthCheck: () => Promise<{ ok: boolean; message: string }>;
};
