import { buildDeliveryNotificationSubject } from '@/domain/delivery-notifications';
import { deliveryEmailPreviewSchema, type DeliveryEmailPreviewInput } from '@/schemas/delivery-notification';

export function buildDeliveryEmailPreview(input: DeliveryEmailPreviewInput) {
  const data = deliveryEmailPreviewSchema.parse(input);
  const greeting = data.recipientName ? `Hi ${data.recipientName},` : 'Hi,';
  const subject = buildDeliveryNotificationSubject(data.notificationType, data.jobId);
  const bodyText = [
    greeting,
    '',
    `${data.packageName ?? 'Your ListingLift image pack'} is ready for secure download:`,
    data.downloadUrl,
    '',
    `This link expires on ${data.expiresAt.toISOString().slice(0, 10)}.`,
    data.deliveryNotes ? `Delivery notes: ${data.deliveryNotes}` : null,
    'Files are provided as platform-ready drafts. Please review them against current marketplace or storefront guidelines before publishing.',
    'Marketplace approval, ranking, sales, conversion, and ad performance are not guaranteed.',
    '',
    'Thanks,',
    'ListingLift',
  ].filter(Boolean).join('\n');
  const html = bodyText.split('\n').map((line) => line ? `<p>${escapeHtml(line)}</p>` : '<br />').join('');
  return { to: data.recipientEmail, subject, bodyText, html, notificationType: data.notificationType };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] ?? char));
}
