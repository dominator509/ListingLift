import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function BeforeAfterCard({ sourceLabel = 'Original', outputLabel = 'Platform-ready draft', note = 'Seller review recommended before publishing.' }: { sourceLabel?: string; outputLabel?: string; note?: string }) {
  return (
    <Card title="Before / after preview" description={note}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Badge>{sourceLabel}</Badge>
          <div className="mt-4 grid aspect-square place-items-center rounded-xl bg-slate-200 text-sm text-slate-700">Raw photo</div>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <Badge tone="blue">{outputLabel}</Badge>
          <div className="mt-4 grid aspect-square place-items-center rounded-xl bg-white text-sm text-blue-600">Clean output</div>
        </div>
      </div>
    </Card>
  );
}
