import { Badge } from '@/components/ui/badge';
import { Card, CardText, CardTitle } from '@/components/ui/card';
import type { PlatformPreset } from '@/domain/platform-presets';

export function PresetCard({ preset }: { preset: PlatformPreset }) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle>{preset.name}</CardTitle>
          <CardText>{preset.platform}</CardText>
        </div>
        <Badge tone={preset.active ? 'green' : 'slate'}>{preset.active ? 'Active' : 'Inactive'}</Badge>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{preset.description}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500">Dimensions</dt>
          <dd className="font-semibold text-slate-950">{preset.width}×{preset.height}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Format</dt>
          <dd className="font-semibold text-slate-950">{preset.format}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Background</dt>
          <dd className="font-semibold text-slate-950">{preset.background.replaceAll('_', ' ')}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Safe margin</dt>
          <dd className="font-semibold text-slate-950">{preset.safeMarginPercent}%</dd>
        </div>
      </dl>
      <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
        <div className="font-semibold text-slate-800">Folder</div>
        <div className="mt-1 font-mono">{preset.folderPath}</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {preset.channelTags.slice(0, 4).map((tag) => (
          <Badge key={tag} tone="blue">{tag}</Badge>
        ))}
      </div>
    </Card>
  );
}
