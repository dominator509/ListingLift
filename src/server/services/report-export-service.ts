export function planReportExport(input: {
  reportId: string;
  organizationId: string;
  audience: 'ADMIN' | 'CLIENT' | 'AGENCY' | 'WHITE_LABEL';
  format?: 'PDF' | 'HTML' | 'CSV' | 'JSON';
}) {
  const format = input.format ?? 'PDF';
  return {
    reportId: input.reportId,
    organizationId: input.organizationId,
    audience: input.audience,
    format,
    storageKey: `reports/${input.organizationId}/${input.reportId}/report.${format.toLowerCase()}`,
    requiresApproval: input.audience !== 'ADMIN',
    clientVisible: false,
    dryRun: true,
  };
}
