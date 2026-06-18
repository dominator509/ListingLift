import { issueDeliveryLinkDraft } from '@/server/services/delivery-link-service';
import { buildDeliveryEmailPreview } from '@/server/services/delivery-email-template-service';
import { buildMarketplaceMessagePreview } from '@/server/services/marketplace-delivery-message-service';
import { sendDeliveryNotification, buildNotificationLogDraft } from '@/server/services/delivery-notification-service';
import { deliveryLinkIssueSchema, type DeliveryLinkIssueInput } from '@/schemas/delivery-notification';

export async function prepareDeliverySendDraft(input: DeliveryLinkIssueInput & { organizationId?: string; clientId?: string | null; actorUserId?: string | null; packageName?: string | null; appUrl?: string }) {
  const data = deliveryLinkIssueSchema.parse(input);
  const link = issueDeliveryLinkDraft({ ...data, organizationId: input.organizationId, clientId: input.clientId, actorUserId: input.actorUserId, appUrl: input.appUrl });
  const email = buildDeliveryEmailPreview({
    jobId: data.jobId,
    recipientEmail: data.recipientEmail,
    recipientName: data.recipientName,
    packageName: input.packageName,
    downloadUrl: link.publicUrl,
    expiresAt: link.expiresAt,
    deliveryNotes: data.deliveryNotes,
    notificationType: 'DOWNLOAD_READY',
  });
  const marketplaceMessage = buildMarketplaceMessagePreview({
    templateKey: data.marketplaceTemplateKey,
    buyerName: data.recipientName,
    packageName: input.packageName,
    downloadUrl: link.publicUrl,
    expiresAt: link.expiresAt,
    revisionInstructions: 'Please send revision notes through the approved order/project channel.',
  });
  const notificationResult = data.sendEmail
    ? await sendDeliveryNotification({ type: 'DOWNLOAD_READY', to: data.recipientEmail, subject: email.subject, bodyText: email.bodyText, jobId: data.jobId, clientId: input.clientId, dryRun: true })
    : { ok: true, dryRun: true, status: 'SKIPPED', providerKey: 'manual-only', redactedTo: data.recipientEmail.replace(/(^.).*(@.*$)/, '$1***$2') };

  return {
    link: { ...link, tokenHash: '[redacted]' },
    email,
    marketplaceMessage,
    notificationLogDraft: buildNotificationLogDraft({ type: 'DOWNLOAD_READY', to: data.recipientEmail, subject: email.subject, bodyText: email.bodyText, jobId: data.jobId, clientId: input.clientId, dryRun: true, providerKey: notificationResult.providerKey, status: notificationResult.status }),
    notificationResult,
    codexNote: 'Dry-run delivery send only. Codex must persist hashed token, send through configured adapter, record notification/download/audit logs, and update job status transactionally.',
  };
}
