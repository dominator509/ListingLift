import { isClientFilePayloadUnsafe, redactTaskIntegrationPayload, type TaskNotificationEventKey } from '@/domain/task-notification-integrations';

const allowedKeys = new Set([
  'organizationId', 'jobId', 'clientId', 'externalOrderId', 'packageKey', 'status', 'deadline', 'amount', 'currency', 'channel', 'eventKey', 'title', 'message', 'summary', 'operatorUrl', 'clientDashboardUrl'
]);

export function sanitizeTaskNotificationPayload(payload: Record<string, unknown>) {
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (allowedKeys.has(key)) safe[key] = value;
  }
  return redactTaskIntegrationPayload(safe);
}

export function buildTaskNotificationPayload(input: { eventKey: TaskNotificationEventKey; payload: Record<string, unknown> }) {
  const sanitized = sanitizeTaskNotificationPayload({ ...input.payload, eventKey: input.eventKey });
  return {
    eventKey: input.eventKey,
    payload: sanitized,
    unsafeFilePayloadDetected: isClientFilePayloadUnsafe(input.payload),
  };
}
