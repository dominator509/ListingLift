export type AuditAction =
  | 'auth.login'
  | 'auth.logout'
  | 'client.create'
  | 'job.create'
  | 'job.status_change'
  | 'job.approve'
  | 'job.reject'
  | 'job.manual_override'
  | 'delivery.generate'
  | 'delivery.send'
  | 'billing.credit_adjust'
  | 'integration.connect'
  | 'integration.disconnect'
  | 'permission.change';

export type AuditEntryInput = {
  organizationId?: string | null;
  actorUserId?: string | null;
  jobId?: string | null;
  action: AuditAction | string;
  targetType: string;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
};

export function redactAuditMetadata(metadata: Record<string, unknown> = {}) {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [
      key,
      /secret|token|password|authorization|apiKey/i.test(key) ? '[redacted]' : value,
    ]),
  );
}
