import { Card } from '@/components/ui/card';

export type JobQueueSummary = {
  total: number;
  overdue: number;
  dueSoon: number;
  waitingForUpload: number;
  waitingForReview: number;
  readyForDelivery: number;
};

export function JobQueueSummaryCards({ summary }: { summary: JobQueueSummary }) {
  const cards = [
    ['Total jobs', summary.total],
    ['Overdue', summary.overdue],
    ['Due soon', summary.dueSoon],
    ['Waiting upload', summary.waitingForUpload],
    ['Review queue', summary.waitingForReview],
    ['Ready delivery', summary.readyForDelivery],
  ] as const;
  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
      {cards.map(([label, value]) => (
        <Card key={label} className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-bold text-slate-950">{value}</div>
        </Card>
      ))}
    </div>
  );
}
