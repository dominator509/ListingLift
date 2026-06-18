import { Card } from '@/components/ui/card';
import { PreviewStatusBadge } from './preview-status-badge';
import type { PreviewGalleryItem } from '@/domain/preview-gallery';

export function ImageDetailPreviewPanel({ item }: { item: PreviewGalleryItem }) {
  return (
    <Card title="Image detail" description="Output-level review data for admin preview decisions.">
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div><dt className="font-semibold text-slate-700">Output</dt><dd className="text-slate-600">{item.outputFileName}</dd></div>
        <div><dt className="font-semibold text-slate-700">Status</dt><dd><PreviewStatusBadge status={item.reviewStatus} /></dd></div>
        <div><dt className="font-semibold text-slate-700">Preset</dt><dd className="text-slate-600">{item.presetKey ?? 'Custom'}</dd></div>
        <div><dt className="font-semibold text-slate-700">Dimensions</dt><dd className="text-slate-600">{item.width ?? '—'} × {item.height ?? '—'}</dd></div>
        <div><dt className="font-semibold text-slate-700">Client visibility</dt><dd className="text-slate-600">{item.clientVisible ? 'Visible' : 'Hidden'}</dd></div>
        <div><dt className="font-semibold text-slate-700">Quality flags</dt><dd className="text-slate-600">{item.flags.join(', ') || 'None'}</dd></div>
      </dl>
    </Card>
  );
}
