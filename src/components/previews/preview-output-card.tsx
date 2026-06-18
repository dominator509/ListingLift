import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PreviewStatusBadge } from './preview-status-badge';
import type { PreviewGalleryItem } from '@/domain/preview-gallery';

export function PreviewOutputCard({ item, selectable = false }: { item: PreviewGalleryItem; selectable?: boolean }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="grid aspect-square place-items-center bg-slate-100 text-sm text-slate-500">
        {item.previewUrl ? <img src={item.previewUrl} alt={item.outputFileName} className="h-full w-full object-contain" /> : 'Preview image'}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-950">{item.outputFileName}</p>
            <p className="text-xs text-slate-500">{item.presetKey ?? 'custom preset'} · {item.outputType}</p>
          </div>
          {selectable ? <input aria-label={`Select ${item.outputFileName}`} type="checkbox" className="mt-1" /> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <PreviewStatusBadge status={item.reviewStatus} />
          {item.clientVisible ? <Badge tone="green">client visible</Badge> : <Badge>admin only</Badge>}
          {item.qualityScore != null ? <Badge tone="purple">quality {item.qualityScore}</Badge> : null}
        </div>
        {item.flags.length ? <p className="text-xs text-amber-700">Flags: {item.flags.join(', ')}</p> : null}
        <p className="text-xs leading-5 text-slate-500">{item.safeClaim}</p>
      </div>
    </Card>
  );
}
