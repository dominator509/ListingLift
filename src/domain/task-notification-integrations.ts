export type TaskNotificationProviderKey =
  | 'internal_email'
  | 'slack'
  | 'smtp_email'
  | 'google_sheets'
  | 'airtable'
  | 'trello'
  | 'clickup'
  | 'asana'
  | 'notion';

export type TaskNotificationActionKey =
  | 'SEND_SLACK_ALERT'
  | 'SEND_EMAIL'
  | 'EXPORT_GOOGLE_SHEET_ROW'
  | 'EXPORT_AIRTABLE_RECORD'
  | 'CREATE_TRELLO_CARD'
  | 'CREATE_CLICKUP_TASK'
  | 'CREATE_ASANA_TASK'
  | 'CREATE_NOTION_PAGE'
  | 'EXPORT_REPORT_DATA';

export type TaskNotificationEventKey =
  | 'NEW_PAID_ORDER'
  | 'UPLOAD_RECEIVED'
  | 'WAITING_FOR_REVIEW'
  | 'FLAGGED_OUTPUTS'
  | 'REVISION_REQUESTED'
  | 'READY_FOR_DELIVERY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CREDITS_LOW'
  | 'UPSELL_READY';

export type TaskNotificationConnectionStatus = 'DRAFT' | 'ENABLED' | 'PAUSED' | 'FAILED' | 'DISABLED' | 'REVOKED';
export type TaskNotificationDeliveryStatus = 'PLANNED' | 'QUEUED' | 'SENT' | 'SKIPPED' | 'FAILED' | 'MANUAL_FALLBACK';

export type TaskNotificationProviderDefinition = {
  key: TaskNotificationProviderKey;
  label: string;
  category: 'notification' | 'data_export' | 'task_management' | 'knowledge_base';
  enabledEnvVar: string;
  realCallsEnvVar?: string;
  secretFields: string[];
  supportedActions: TaskNotificationActionKey[];
  supportsDryRun: boolean;
  supportsHealthCheck: boolean;
  manualFallbackAvailable: boolean;
  safeDescription: string;
};

export const TASK_NOTIFICATION_SAFE_COPY =
  'Notifications and task/data exports are optional operator-support tools. ListingLift fulfillment must remain reliable through manual fallback if Slack, email, Sheets, Airtable, Trello, ClickUp, Asana, or Notion is unavailable.';

export const TASK_NOTIFICATION_SECURITY_RULES = [
  'Never expose Slack tokens, SMTP credentials, Google credentials, Airtable tokens, Trello keys, ClickUp tokens, Asana tokens, Notion tokens, or webhook secrets to the frontend.',
  'Store all provider credentials as encrypted secret references or environment variables only.',
  'Real provider calls must remain disabled unless both provider-specific and global real-integration flags are enabled.',
  'Do not export raw client files, unapproved delivery links, secrets, private admin notes, provider keys, or marketplace passwords.',
  'Keep payloads minimal, redacted, and tenant-scoped.',
  'Do not allow task integrations to block paid fulfillment; create manual fallback work instead.',
  'Rate-limit test, export, alert, task creation, and health-check routes.',
  'Audit every connection, secret-reference change, alert, export, task creation, failure, retry, and manual fallback.',
  'Use compliance-safe language and do not promise marketplace approval, ranking, sales, conversion, or ad performance.',
] as const;

export const TASK_NOTIFICATION_PROVIDERS: TaskNotificationProviderDefinition[] = [
  {
    key: 'internal_email',
    label: 'Internal email mock',
    category: 'notification',
    enabledEnvVar: 'MOCK_INTEGRATIONS_ENABLED',
    secretFields: [],
    supportedActions: ['SEND_EMAIL'],
    supportsDryRun: true,
    supportsHealthCheck: true,
    manualFallbackAvailable: true,
    safeDescription: 'Default mock/internal email provider for local development and tests.',
  },
  {
    key: 'slack',
    label: 'Slack alerts',
    category: 'notification',
    enabledEnvVar: 'SLACK_ENABLED',
    realCallsEnvVar: 'REAL_INTEGRATIONS_ENABLED',
    secretFields: ['SLACK_BOT_TOKEN', 'SLACK_SIGNING_SECRET', 'SLACK_WEBHOOK_URL'],
    supportedActions: ['SEND_SLACK_ALERT'],
    supportsDryRun: true,
    supportsHealthCheck: true,
    manualFallbackAvailable: true,
    safeDescription: 'Slack alert scaffold for operator notifications and queue updates.',
  },
  {
    key: 'smtp_email',
    label: 'SMTP email',
    category: 'notification',
    enabledEnvVar: 'EMAIL_ENABLED',
    realCallsEnvVar: 'REAL_INTEGRATIONS_ENABLED',
    secretFields: ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'EMAIL_FROM'],
    supportedActions: ['SEND_EMAIL'],
    supportsDryRun: true,
    supportsHealthCheck: true,
    manualFallbackAvailable: true,
    safeDescription: 'SMTP email scaffold for controlled operational and client notifications.',
  },
  {
    key: 'google_sheets',
    label: 'Google Sheets export',
    category: 'data_export',
    enabledEnvVar: 'GOOGLE_SHEETS_ENABLED',
    realCallsEnvVar: 'REAL_INTEGRATIONS_ENABLED',
    secretFields: ['GOOGLE_SHEETS_CLIENT_EMAIL', 'GOOGLE_SHEETS_PRIVATE_KEY', 'GOOGLE_SHEETS_SPREADSHEET_ID'],
    supportedActions: ['EXPORT_GOOGLE_SHEET_ROW', 'EXPORT_REPORT_DATA'],
    supportsDryRun: true,
    supportsHealthCheck: true,
    manualFallbackAvailable: true,
    safeDescription: 'Google Sheets export scaffold for sanitized job, revenue, and report rows.',
  },
  {
    key: 'airtable',
    label: 'Airtable export',
    category: 'data_export',
    enabledEnvVar: 'AIRTABLE_ENABLED',
    realCallsEnvVar: 'REAL_INTEGRATIONS_ENABLED',
    secretFields: ['AIRTABLE_API_TOKEN', 'AIRTABLE_BASE_ID', 'AIRTABLE_TABLE_ID'],
    supportedActions: ['EXPORT_AIRTABLE_RECORD', 'EXPORT_REPORT_DATA'],
    supportsDryRun: true,
    supportsHealthCheck: true,
    manualFallbackAvailable: true,
    safeDescription: 'Airtable export scaffold for sanitized fulfillment and revenue data.',
  },
  {
    key: 'trello',
    label: 'Trello cards',
    category: 'task_management',
    enabledEnvVar: 'TRELLO_ENABLED',
    realCallsEnvVar: 'REAL_INTEGRATIONS_ENABLED',
    secretFields: ['TRELLO_API_KEY', 'TRELLO_TOKEN', 'TRELLO_BOARD_ID', 'TRELLO_LIST_ID'],
    supportedActions: ['CREATE_TRELLO_CARD'],
    supportsDryRun: true,
    supportsHealthCheck: true,
    manualFallbackAvailable: true,
    safeDescription: 'Trello task scaffold for operator work cards.',
  },
  {
    key: 'clickup',
    label: 'ClickUp tasks',
    category: 'task_management',
    enabledEnvVar: 'CLICKUP_ENABLED',
    realCallsEnvVar: 'REAL_INTEGRATIONS_ENABLED',
    secretFields: ['CLICKUP_API_TOKEN', 'CLICKUP_LIST_ID'],
    supportedActions: ['CREATE_CLICKUP_TASK'],
    supportsDryRun: true,
    supportsHealthCheck: true,
    manualFallbackAvailable: true,
    safeDescription: 'ClickUp task scaffold for fulfillment queue tasks.',
  },
  {
    key: 'asana',
    label: 'Asana tasks',
    category: 'task_management',
    enabledEnvVar: 'ASANA_ENABLED',
    realCallsEnvVar: 'REAL_INTEGRATIONS_ENABLED',
    secretFields: ['ASANA_ACCESS_TOKEN', 'ASANA_PROJECT_ID'],
    supportedActions: ['CREATE_ASANA_TASK'],
    supportsDryRun: true,
    supportsHealthCheck: true,
    manualFallbackAvailable: true,
    safeDescription: 'Asana task scaffold for fulfillment and approval work.',
  },
  {
    key: 'notion',
    label: 'Notion pages',
    category: 'knowledge_base',
    enabledEnvVar: 'NOTION_ENABLED',
    realCallsEnvVar: 'REAL_INTEGRATIONS_ENABLED',
    secretFields: ['NOTION_API_TOKEN', 'NOTION_DATABASE_ID'],
    supportedActions: ['CREATE_NOTION_PAGE', 'EXPORT_REPORT_DATA'],
    supportsDryRun: true,
    supportsHealthCheck: true,
    manualFallbackAvailable: true,
    safeDescription: 'Notion export scaffold for sanitized client/job/report knowledge pages.',
  },
];

export function getTaskNotificationProvider(key: TaskNotificationProviderKey) {
  const provider = TASK_NOTIFICATION_PROVIDERS.find((candidate) => candidate.key === key);
  if (!provider) throw new Error(`Unsupported task notification provider: ${key}`);
  return provider;
}

export function providerSupportsAction(providerKey: TaskNotificationProviderKey, actionKey: TaskNotificationActionKey) {
  return getTaskNotificationProvider(providerKey).supportedActions.includes(actionKey);
}

export function buildTaskNotificationDedupeKey(input: { organizationId: string; providerKey: TaskNotificationProviderKey; actionKey: TaskNotificationActionKey; jobId?: string; sourceId?: string }) {
  return [input.organizationId, input.providerKey, input.actionKey, input.jobId ?? 'no-job', input.sourceId ?? 'no-source'].join(':').toLowerCase();
}

export function redactTaskIntegrationPayload<T extends Record<string, unknown>>(payload: T): T {
  const redacted = { ...payload } as Record<string, unknown>;
  for (const key of Object.keys(redacted)) {
    const lower = key.toLowerCase();
    if (lower.includes('token') || lower.includes('secret') || lower.includes('password') || lower.includes('privatekey') || lower.includes('api_key') || lower.includes('apikey')) {
      redacted[key] = '[redacted]';
    }
    if (lower.includes('email') && typeof redacted[key] === 'string') {
      redacted[key] = String(redacted[key]).replace(/(.{2}).+(@.+)/, '$1***$2');
    }
  }
  return redacted as T;
}

export function isClientFilePayloadUnsafe(payload: Record<string, unknown>) {
  return Object.keys(payload).some((key) => {
    const lower = key.toLowerCase();
    return lower.includes('rawfile') || lower.includes('filebytes') || lower.includes('downloadtoken') || lower.includes('deliverytoken') || lower.includes('signedurl');
  });
}
