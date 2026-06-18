import type { ReportMetricInput } from '@/domain/reports-upsells';

export type ReportMetricSnapshotDraft = ReportMetricInput & {
  organizationId: string;
  clientId?: string;
  jobId?: string;
  reportId?: string;
  capturedAt: string;
};

export function buildMetricSnapshots(input: {
  organizationId: string;
  clientId?: string;
  jobId?: string;
  reportId?: string;
  metrics: ReportMetricInput[];
}): ReportMetricSnapshotDraft[] {
  return input.metrics.map((metric) => ({
    ...metric,
    organizationId: input.organizationId,
    clientId: input.clientId,
    jobId: input.jobId,
    reportId: input.reportId,
    capturedAt: new Date().toISOString(),
  }));
}

export function summarizeMetricSnapshots(metrics: ReportMetricInput[]) {
  const byKind = new Map<string, ReportMetricInput[]>();
  for (const metric of metrics) {
    const list = byKind.get(metric.kind) ?? [];
    list.push(metric);
    byKind.set(metric.kind, list);
  }
  return Array.from(byKind.entries()).map(([kind, values]) => ({
    kind,
    count: values.length,
    numericTotal: values.reduce((sum, item) => sum + (item.numericValue ?? 0), 0),
  }));
}
