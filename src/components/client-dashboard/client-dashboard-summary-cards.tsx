import { Card } from '@/components/ui/card';

export function ClientDashboardSummaryCards({ activeJobs, readyDownloads, openRevisions, creditsRemaining }: { activeJobs: number; readyDownloads: number; openRevisions: number; creditsRemaining: number }) {
  const cards = [
    ['Active jobs', activeJobs, 'Uploads, processing, review, or revisions in progress.'],
    ['Ready downloads', readyDownloads, 'Only approved delivery links appear here.'],
    ['Open revisions', openRevisions, 'Requests waiting for operator review or reprocessing.'],
    ['Credits left', creditsRemaining, 'Based on verified billing and credit ledger state.'],
  ] as const;
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map(([label, value, helper]) => (
        <Card key={label}>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{helper}</p>
        </Card>
      ))}
    </div>
  );
}
