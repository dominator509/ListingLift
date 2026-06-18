export type AutomationWebhookProviderKey = 'internal_mock' | 'generic_webhook' | 'zapier_webhook' | 'make_webhook' | 'n8n_webhook';
export type AutomationTriggerKey =
  | 'NEW_PAID_ORDER'
  | 'NEW_IMAGE_UPLOAD'
  | 'JOB_PROCESSING_STARTED'
  | 'JOB_WAITING_FOR_REVIEW'
  | 'JOB_COMPLETED'
  | 'REVISION_REQUESTED'
  | 'DOWNLOAD_READY'
  | 'CREDITS_LOW'
  | 'SUBSCRIPTION_INACTIVE'
  | 'UPSELL_OPPORTUNITY_DETECTED';
export type AutomationActionKey =
  | 'CREATE_JOB'
  | 'SEND_EMAIL'
  | 'CREATE_SLACK_MESSAGE'
  | 'CREATE_TRELLO_CARD'
  | 'CREATE_CLICKUP_TASK'
  | 'CREATE_GOOGLE_DRIVE_FOLDER'
  | 'EXPORT_ZIP'
  | 'UPDATE_CRM'
  | 'NOTIFY_ADMIN';
export type AutomationSubscriptionStatus = 'DRAFT' | 'ENABLED' | 'PAUSED' | 'FAILED' | 'DISABLED' | 'REVOKED';
export type AutomationDispatchStatus = 'PLANNED' | 'QUEUED' | 'SENT' | 'SKIPPED' | 'FAILED' | 'DEAD_LETTERED';
export type AutomationRetryDecision = 'DO_NOT_RETRY' | 'RETRY_SOON' | 'RETRY_WITH_BACKOFF' | 'MOVE_TO_DEAD_LETTER';

export type AutomationProviderDefinition = {
  key: AutomationWebhookProviderKey;
  label: string;
  enabledEnvVar: string;
  realCallsEnvVar?: string;
  secretFields: string[];
  supportedActions: AutomationActionKey[];
  supportsSignedPayloads: boolean;
  supportsRetries: boolean;
  manualFallbackAvailable: boolean;
  safeDescription: string;
};

export type AutomationTriggerDefinition = {
  key: AutomationTriggerKey;
  label: string;
  description: string;
  defaultActions: AutomationActionKey[];
  requiresTenantScope: boolean;
  clientVisible: boolean;
};

export const AUTOMATION_WEBHOOK_SAFE_COPY =
  'Automation webhooks are optional, feature-flagged outbound notifications and task/export triggers. ListingLift must keep paid fulfillment reliable without automation, log every dispatch attempt, and never expose secrets or client files through third-party automations.';

export const AUTOMATION_WEBHOOK_SECURITY_RULES = [
  'Automation is optional; fulfillment must continue manually if automation fails.',
  'Real webhook calls are disabled by default and require explicit feature flags.',
  'Never expose webhook URLs, signing secrets, OAuth tokens, API keys, or provider credentials to the frontend.',
  'Store webhook secrets only as encrypted secret references or environment variables.',
  'Sign outbound webhook payloads where supported.',
  'Validate inbound test payloads and protect against SSRF if any URL is accepted from an operator.',
  'Do not send raw client images, unapproved delivery links, provider secrets, marketplace passwords, or private notes to automation providers.',
  'Send only redacted, scoped, minimum-necessary event payloads.',
  'Rate-limit webhook test, dispatch, retry, and subscription routes.',
  'Audit subscription changes, dispatch attempts, retries, failures, and manual overrides.',
] as const;

export const AUTOMATION_TRIGGERS: AutomationTriggerDefinition[] = [
  { key: 'NEW_PAID_ORDER', label: 'New paid order', description: 'A verified Stripe, Gumroad, manual invoice, or marketplace payment creates paid fulfillment work.', defaultActions: ['NOTIFY_ADMIN', 'CREATE_JOB', 'SEND_EMAIL'], requiresTenantScope: true, clientVisible: false },
  { key: 'NEW_IMAGE_UPLOAD', label: 'New image upload', description: 'A client or operator upload batch has been received and validated.', defaultActions: ['NOTIFY_ADMIN', 'CREATE_GOOGLE_DRIVE_FOLDER'], requiresTenantScope: true, clientVisible: false },
  { key: 'JOB_PROCESSING_STARTED', label: 'Job processing started', description: 'Processing has entered queued or processing state.', defaultActions: ['NOTIFY_ADMIN'], requiresTenantScope: true, clientVisible: false },
  { key: 'JOB_WAITING_FOR_REVIEW', label: 'Job waiting for review', description: 'Outputs are generated and need QC/operator approval.', defaultActions: ['CREATE_TRELLO_CARD', 'CREATE_CLICKUP_TASK', 'NOTIFY_ADMIN'], requiresTenantScope: true, clientVisible: false },
  { key: 'JOB_COMPLETED', label: 'Job completed', description: 'A job has been marked completed after approved delivery.', defaultActions: ['UPDATE_CRM', 'NOTIFY_ADMIN'], requiresTenantScope: true, clientVisible: false },
  { key: 'REVISION_REQUESTED', label: 'Revision requested', description: 'A client or operator has opened a revision request.', defaultActions: ['CREATE_TRELLO_CARD', 'CREATE_CLICKUP_TASK', 'NOTIFY_ADMIN'], requiresTenantScope: true, clientVisible: false },
  { key: 'DOWNLOAD_READY', label: 'Download ready', description: 'An approved delivery archive is ready for controlled download.', defaultActions: ['SEND_EMAIL', 'NOTIFY_ADMIN'], requiresTenantScope: true, clientVisible: true },
  { key: 'CREDITS_LOW', label: 'Credits low', description: 'A customer or agency is below configured credit threshold.', defaultActions: ['SEND_EMAIL', 'UPDATE_CRM'], requiresTenantScope: true, clientVisible: true },
  { key: 'SUBSCRIPTION_INACTIVE', label: 'Subscription inactive', description: 'A subscription or retainer entitlement is inactive, cancelled, or past due.', defaultActions: ['SEND_EMAIL', 'UPDATE_CRM'], requiresTenantScope: true, clientVisible: true },
  { key: 'UPSELL_OPPORTUNITY_DETECTED', label: 'Upsell opportunity detected', description: 'Reports or usage patterns suggest a retainer, listing audit, or creative-pack offer.', defaultActions: ['UPDATE_CRM', 'NOTIFY_ADMIN'], requiresTenantScope: true, clientVisible: false },
];

export const AUTOMATION_PROVIDERS: AutomationProviderDefinition[] = [
  {
    key: 'internal_mock',
    label: 'Internal mock automation',
    enabledEnvVar: 'MOCK_INTEGRATIONS_ENABLED',
    secretFields: [],
    supportedActions: ['NOTIFY_ADMIN', 'SEND_EMAIL', 'CREATE_JOB', 'EXPORT_ZIP', 'UPDATE_CRM'],
    supportsSignedPayloads: false,
    supportsRetries: true,
    manualFallbackAvailable: true,
    safeDescription: 'Default mock adapter for tests and local workflows. It never calls external services.',
  },
  {
    key: 'generic_webhook',
    label: 'Generic signed webhook',
    enabledEnvVar: 'GENERIC_AUTOMATION_WEBHOOKS_ENABLED',
    realCallsEnvVar: 'REAL_INTEGRATIONS_ENABLED',
    secretFields: ['WEBHOOK_URL', 'WEBHOOK_SIGNING_SECRET'],
    supportedActions: ['NOTIFY_ADMIN', 'UPDATE_CRM', 'EXPORT_ZIP'],
    supportsSignedPayloads: true,
    supportsRetries: true,
    manualFallbackAvailable: true,
    safeDescription: 'Generic outbound webhook scaffold for approved internal or customer-owned automation endpoints.',
  },
  {
    key: 'zapier_webhook',
    label: 'Zapier webhook',
    enabledEnvVar: 'ZAPIER_WEBHOOKS_ENABLED',
    realCallsEnvVar: 'REAL_INTEGRATIONS_ENABLED',
    secretFields: ['ZAPIER_WEBHOOK_URL', 'WEBHOOK_SIGNING_SECRET'],
    supportedActions: ['SEND_EMAIL', 'CREATE_SLACK_MESSAGE', 'CREATE_TRELLO_CARD', 'CREATE_GOOGLE_DRIVE_FOLDER', 'UPDATE_CRM', 'NOTIFY_ADMIN'],
    supportsSignedPayloads: true,
    supportsRetries: true,
    manualFallbackAvailable: true,
    safeDescription: 'Zapier outbound webhook scaffold. It should send redacted, minimal payloads only after operator configuration.',
  },
  {
    key: 'make_webhook',
    label: 'Make webhook',
    enabledEnvVar: 'MAKE_WEBHOOKS_ENABLED',
    realCallsEnvVar: 'REAL_INTEGRATIONS_ENABLED',
    secretFields: ['MAKE_WEBHOOK_URL', 'WEBHOOK_SIGNING_SECRET'],
    supportedActions: ['SEND_EMAIL', 'CREATE_SLACK_MESSAGE', 'CREATE_GOOGLE_DRIVE_FOLDER', 'UPDATE_CRM', 'NOTIFY_ADMIN'],
    supportsSignedPayloads: true,
    supportsRetries: true,
    manualFallbackAvailable: true,
    safeDescription: 'Make outbound webhook scaffold for scenario automation with redacted payloads.',
  },
  {
    key: 'n8n_webhook',
    label: 'n8n webhook',
    enabledEnvVar: 'N8N_WEBHOOKS_ENABLED',
    realCallsEnvVar: 'REAL_INTEGRATIONS_ENABLED',
    secretFields: ['N8N_WEBHOOK_URL', 'WEBHOOK_SIGNING_SECRET'],
    supportedActions: ['SEND_EMAIL', 'CREATE_SLACK_MESSAGE', 'CREATE_TRELLO_CARD', 'CREATE_CLICKUP_TASK', 'UPDATE_CRM', 'NOTIFY_ADMIN'],
    supportsSignedPayloads: true,
    supportsRetries: true,
    manualFallbackAvailable: true,
    safeDescription: 'n8n outbound webhook scaffold for self-hosted workflow automation. Secrets must remain encrypted.',
  },
];

export function getAutomationProvider(key: AutomationWebhookProviderKey) {
  const provider = AUTOMATION_PROVIDERS.find((candidate) => candidate.key === key);
  if (!provider) throw new Error(`Unsupported automation provider: ${key}`);
  return provider;
}

export function getAutomationTrigger(key: AutomationTriggerKey) {
  const trigger = AUTOMATION_TRIGGERS.find((candidate) => candidate.key === key);
  if (!trigger) throw new Error(`Unsupported automation trigger: ${key}`);
  return trigger;
}

export function buildAutomationDedupeKey(input: { organizationId: string; triggerKey: AutomationTriggerKey; jobId?: string; externalOrderId?: string; sourceId?: string }) {
  return [input.organizationId, input.triggerKey, input.jobId ?? 'no-job', input.externalOrderId ?? 'no-order', input.sourceId ?? 'no-source'].join(':').toLowerCase();
}

export function redactAutomationPayload<T extends Record<string, unknown>>(payload: T): T {
  const redacted = { ...payload } as Record<string, unknown>;
  for (const key of Object.keys(redacted)) {
    const lower = key.toLowerCase();
    if (lower.includes('secret') || lower.includes('token') || lower.includes('password') || lower.includes('apikey') || lower.includes('api_key') || lower.includes('signedurl') || lower.includes('signed_url')) {
      redacted[key] = '[redacted]';
    }
    if (lower.includes('email') && typeof redacted[key] === 'string') {
      const value = String(redacted[key]);
      redacted[key] = value.replace(/(.{2}).+(@.+)/, '$1***$2');
    }
  }
  return redacted as T;
}

export function requiresAutomationManualFallback(status: AutomationDispatchStatus) {
  return status === 'FAILED' || status === 'DEAD_LETTERED' || status === 'SKIPPED';
}
