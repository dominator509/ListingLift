import { REPORT_SAFE_CLAIMS, assertReportSafeCopy, type ReportBuildInput } from '@/domain/reports-upsells';
import { buildMetricSnapshots, summarizeMetricSnapshots } from './report-metric-service';

export function buildReportDraft(input: ReportBuildInput) {
  const metricSummary = summarizeMetricSnapshots(input.metrics);
  const bodySections = [
    `Report type: ${input.reportType}`,
    `Audience: ${input.audience}`,
    input.qualityNotes?.length ? `Quality notes: ${input.qualityNotes.join(' | ')}` : 'Quality notes: none provided.',
    input.deliveryNotes?.length ? `Delivery notes: ${input.deliveryNotes.join(' | ')}` : 'Delivery notes: none provided.',
    input.recommendationNotes?.length ? `Recommendations: ${input.recommendationNotes.join(' | ')}` : 'Recommendations: seller review recommended.',
    ...REPORT_SAFE_CLAIMS,
  ];
  const body = bodySections.join('\n\n');
  const unsafeMatches = assertReportSafeCopy(body);
  return {
    organizationId: input.organizationId,
    clientId: input.clientId,
    jobId: input.jobId,
    type: input.reportType,
    audience: input.audience,
    status: unsafeMatches.length ? 'NEEDS_COPY_REVIEW' : 'DRAFT',
    title: `${input.reportType.replaceAll('_', ' ')} report`,
    body,
    unsafeMatches,
    metricSummary,
    metricSnapshots: buildMetricSnapshots({
      organizationId: input.organizationId,
      clientId: input.clientId,
      jobId: input.jobId,
      metrics: input.metrics,
    }),
    dryRun: true,
  };
}

export function buildMonthlySellerReport(input: ReportBuildInput) {
  return buildReportDraft({
    ...input,
    reportType: 'MONTHLY_CLEANUP',
    recommendationNotes: [
      ...(input.recommendationNotes ?? []),
      'Consider a monthly refresh cadence for active listings and seasonal campaigns.',
    ],
  });
}
