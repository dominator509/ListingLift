import { Card } from '@/components/ui/card';
import type { PreviewGallerySummary } from '@/domain/preview-gallery';

export function PreviewSummaryCards({ summary }: { summary: PreviewGallerySummary }) {
  const cards = [
    ['Total', summary.total],
    ['Approved', summary.approved],
    ['Client visible', summary.clientVisible],
    ['Before/after pairs', summary.beforeAfterPairs],
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
