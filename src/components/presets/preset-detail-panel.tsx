import { Badge } from '@/components/ui/badge';
import { Card, CardText, CardTitle } from '@/components/ui/card';
import type { PlatformPreset } from '@/domain/platform-presets';

export function PresetDetailPanel({ preset }: { preset: PlatformPreset }) {
  return (
    <Card>
      <CardTitle>{preset.platform} output contract</CardTitle>
      <CardText>{preset.marketplaceSafeClaim}</CardText>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Naming</div>
          <div className="mt-2 font-mono text-sm text-slate-900">{preset.namingConvention}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Compression</div>
          <div className="mt-2 text-sm font-semibold text-slate-900">{preset.compressionTargetKb ? `${preset.compressionTargetKb} KB target` : 'Operator-defined'}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Review</div>
          <div className="mt-2 text-sm font-semibold text-slate-900">{preset.sellerReviewRequired ? 'Seller review required' : 'Operator review required'}</div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {preset.qualityChecks.map((check) => (
          <Badge key={check} tone="slate">{check.replaceAll('_', ' ')}</Badge>
        ))}
      </div>
    </Card>
  );
}
