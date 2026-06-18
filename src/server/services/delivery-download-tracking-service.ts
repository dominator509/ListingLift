import { sha256 } from '@/lib/hash';
import { deliveryDownloadTrackSchema, type DeliveryDownloadTrackInput } from '@/schemas/delivery-notification';

export function buildDownloadTrackingEvent(input: DeliveryDownloadTrackInput & { organizationId?: string; jobId?: string | null; clientId?: string | null; allowed?: boolean; denialReason?: string | null }) {
  const data = deliveryDownloadTrackSchema.parse(input);
  return {
    organizationId: input.organizationId ?? 'codex-wire-organization-id',
    jobId: input.jobId ?? null,
    clientId: input.clientId ?? null,
    deliveryLinkId: data.deliveryLinkId ?? null,
    tokenHash: sha256(data.token),
    eventType: data.eventType,
    allowed: input.allowed ?? data.eventType !== 'DOWNLOAD_DENIED',
    denialReason: input.denialReason ?? null,
    requestIp: data.requestIp ?? null,
    userAgent: data.userAgent ?? null,
    auditEvent: 'delivery.download_event_recorded',
  };
}

export function summarizeDownloadEvents(events: Array<{ eventType: string; allowed?: boolean | null; createdAt?: Date | string | null }>) {
  const started = events.filter((event) => event.eventType === 'DOWNLOAD_STARTED').length;
  const completed = events.filter((event) => event.eventType === 'DOWNLOAD_COMPLETED').length;
  const denied = events.filter((event) => event.eventType === 'DOWNLOAD_DENIED' || event.allowed === false).length;
  return {
    started,
    completed,
    denied,
    lastEventAt: events.map((event) => event.createdAt).filter(Boolean).at(-1) ?? null,
  };
}
