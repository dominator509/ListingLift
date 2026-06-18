import { taskNotificationAlertInputSchema } from '@/schemas/task-notification-integrations';
import { buildOperatorNotificationTemplate } from './notification-template-service';
import { buildTaskNotificationPayload } from './task-notification-payload-service';

export function buildSlackAlertPlan(input: unknown) {
  const parsed = taskNotificationAlertInputSchema.parse(input);
  const template = buildOperatorNotificationTemplate({ eventKey: parsed.eventKey, title: parsed.title, message: parsed.message, jobId: parsed.jobId });
  const payload = buildTaskNotificationPayload({ eventKey: parsed.eventKey, payload: parsed.payload });
  return {
    providerKey: 'slack' as const,
    actionKey: 'SEND_SLACK_ALERT' as const,
    dryRun: parsed.dryRun,
    channel: 'configured-by-codex',
    text: `*${template.title}*\n${template.plainText}`,
    payload: payload.payload,
    unsafeFilePayloadDetected: payload.unsafeFilePayloadDetected,
  };
}
