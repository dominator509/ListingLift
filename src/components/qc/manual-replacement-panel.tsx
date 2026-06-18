import { Card } from '@/components/ui/card';
import { buildManualReplacementQcDraft } from '@/server/services/manual-replacement-qc-service';

export function ManualReplacementPanel() {
  const draft = buildManualReplacementQcDraft({ organizationId: 'demo-org', jobId: 'JOB-DEMO-001', processedFileId: 'demo-processed-flagged', reason: 'Failed mask or missing product part requires manual edited replacement.' });
  return (
    <Card title="Manual replacement fallback" description="Manual cleanup remains a core fallback when providers or masks fail.">
      <p className="text-sm leading-6 text-slate-600">{draft.suggestedWorkflow}</p>
      <p className="mt-3 text-sm font-semibold text-rose-700">Final delivery blocked: {draft.finalDeliveryBlocked ? 'Yes' : 'No'}</p>
    </Card>
  );
}
