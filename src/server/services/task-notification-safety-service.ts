import { TASK_NOTIFICATION_SECURITY_RULES, isClientFilePayloadUnsafe, redactTaskIntegrationPayload } from '@/domain/task-notification-integrations';

export function buildTaskNotificationSafetyReport(input: { payload?: Record<string, unknown>; destination?: string; realCallRequested?: boolean }) {
  const payload = input.payload ?? {};
  const unsafeFilePayloadDetected = isClientFilePayloadUnsafe(payload);
  const secretLikeKeys = Object.keys(payload).filter((key) => /secret|token|password|privatekey|api[_-]?key/i.test(key));
  return {
    ok: !unsafeFilePayloadDetected && secretLikeKeys.length === 0,
    unsafeFilePayloadDetected,
    secretLikeKeys,
    redactedPayload: redactTaskIntegrationPayload(payload),
    rules: TASK_NOTIFICATION_SECURITY_RULES,
    realCallRequested: Boolean(input.realCallRequested),
    destination: input.destination ? '[redacted-or-operator-configured]' : undefined,
  };
}
