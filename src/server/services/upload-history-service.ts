import type { UploadEventType } from '@/domain/upload-intake';

export function buildUploadHistoryEvent(input: {
  organizationId: string;
  jobId?: string | null;
  clientId?: string | null;
  uploadBatchId?: string | null;
  imageId?: string | null;
  eventType: UploadEventType;
  severity?: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  metadata?: unknown;
}) {
  return {
    organizationId: input.organizationId,
    jobId: input.jobId ?? undefined,
    clientId: input.clientId ?? undefined,
    uploadBatchId: input.uploadBatchId ?? undefined,
    imageId: input.imageId ?? undefined,
    eventType: input.eventType,
    severity: input.severity ?? 'INFO',
    message: input.message,
    metadata: input.metadata,
    createdAt: new Date().toISOString(),
  };
}

export function summarizeUploadEvents(events: Array<ReturnType<typeof buildUploadHistoryEvent>>) {
  return {
    total: events.length,
    errors: events.filter((event) => event.severity === 'ERROR').length,
    warnings: events.filter((event) => event.severity === 'WARNING').length,
    eventTypes: Array.from(new Set(events.map((event) => event.eventType))).sort(),
  };
}
