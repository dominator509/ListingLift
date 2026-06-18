import { getEmailAdapter } from '@/server/adapters/email/registry';
import { notificationSendSchema, type NotificationSendInput } from '@/schemas/delivery-notification';

export async function sendDeliveryNotification(input: NotificationSendInput) {
  const data = notificationSendSchema.parse(input);
  const adapter = getEmailAdapter();
  if (data.dryRun) {
    return {
      ok: true,
      dryRun: true,
      providerKey: adapter.key,
      redactedTo: data.to.replace(/(^.).*(@.*$)/, '$1***$2'),
      status: 'PLANNED',
      auditEvent: 'notification.dry_run_prepared',
    };
  }
  const result = await adapter.send({ to: data.to, subject: data.subject, text: data.bodyText, metadata: { type: data.type, jobId: data.jobId, clientId: data.clientId } });
  return {
    ...result,
    status: result.ok ? 'SENT' : result.skipped ? 'SKIPPED' : 'FAILED',
    auditEvent: 'notification.send_requested',
  };
}

export function buildNotificationLogDraft(input: NotificationSendInput & { organizationId?: string; providerKey?: string; status?: string; messageId?: string | null; errorMessage?: string | null }) {
  const data = notificationSendSchema.parse(input);
  return {
    organizationId: input.organizationId ?? 'codex-wire-organization-id',
    jobId: data.jobId ?? null,
    clientId: data.clientId ?? null,
    type: data.type,
    providerKey: input.providerKey ?? 'mock-email',
    status: input.status ?? 'PLANNED',
    recipientRedacted: data.to.replace(/(^.).*(@.*$)/, '$1***$2'),
    subject: data.subject,
    bodyPreview: data.bodyText.slice(0, 240),
    providerMessageId: input.messageId ?? null,
    errorMessage: input.errorMessage ?? null,
  };
}
