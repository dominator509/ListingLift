import { Card } from '@/components/ui/card';

type QualitySummary = {
  total: number;
  passed: number;
  pending: number;
  flagged: number;
  failed: number;
  blockers: number;
  warnings: number;
  deliveryBlocked: boolean;
  manualFallbackRequired: boolean;
};

export function QualitySummaryCards({ summary }: { summary: QualitySummary }) {
  const cards = [
    ['Total outputs', summary.total],
    ['Passed', summary.passed],
    ['Flagged/failed', summary.flagged + summary.failed],
    ['Blockers', summary.blockers],
  ] as const;
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map(([label, value]) => (
        <Card key={label} className="p-4">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </Card>
      ))}
    </div>
  );
}
