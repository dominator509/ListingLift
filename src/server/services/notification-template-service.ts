import type { TaskNotificationEventKey } from '@/domain/task-notification-integrations';

export function buildOperatorNotificationTemplate(input: { eventKey: TaskNotificationEventKey; title?: string; message?: string; jobId?: string }) {
  const title = input.title ?? `ListingLift: ${input.eventKey.replaceAll('_', ' ').toLowerCase()}`;
  const message = input.message ?? 'A ListingLift workflow event needs operator review.';
  return {
    title,
    subject: title,
    plainText: `${message}${input.jobId ? `\nJob: ${input.jobId}` : ''}\n\nReview in ListingLift before taking client-facing action.`,
    safeDisclaimer: 'No marketplace approval, ranking, sales, conversion, or ad-performance result is guaranteed.',
  };
}
