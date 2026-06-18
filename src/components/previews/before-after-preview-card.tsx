import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { BeforeAfterPair } from '@/domain/preview-gallery';

export function BeforeAfterPreviewCard({ pair }: { pair: BeforeAfterPair }) {
  const output = pair.bestOutput;
  return (
    <Card title="Before / after" description="Admin review comparison. Client-facing preview requires approved output visibility.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Badge>Original</Badge>
          <div className="mt-4 grid aspect-square place-items-center rounded-xl bg-slate-200 text-sm text-slate-500">{pair.originalName}</div>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <Badge tone={output?.clientVisible ? 'green' : 'blue'}>{output?.reviewStatus.replaceAll('_', ' ').toLowerCase() ?? 'output'}</Badge>
          <div className="mt-4 grid aspect-square place-items-center rounded-xl bg-white text-sm text-blue-600">
            {output?.previewUrl ? <img src={output.previewUrl} alt={output.outputFileName} className="h-full w-full object-contain" /> : output?.outputFileName ?? 'Clean output'}
          </div>
        </div>
      </div>
    </Card>
  );
}
