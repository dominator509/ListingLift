import { Card } from '@/components/ui/card';

export type PreviewAvailableFilters = {
  outputTypes: string[];
  presetKeys: string[];
  platforms: string[];
  reviewStatuses: string[];
};

export function PreviewFilterBar({ filters }: { filters: PreviewAvailableFilters }) {
  return (
    <Card title="Preview filters" description="Filter by output type, preset, platform, approval state, flagged outputs, or failed outputs.">
      <div className="grid gap-4 text-sm sm:grid-cols-4">
        <div><span className="font-semibold text-slate-700">Output types</span><p className="mt-1 text-slate-500">{filters.outputTypes.join(', ') || 'All'}</p></div>
        <div><span className="font-semibold text-slate-700">Presets</span><p className="mt-1 text-slate-500">{filters.presetKeys.join(', ') || 'All'}</p></div>
        <div><span className="font-semibold text-slate-700">Platforms</span><p className="mt-1 text-slate-500">{filters.platforms.join(', ') || 'All'}</p></div>
        <div><span className="font-semibold text-slate-700">Review states</span><p className="mt-1 text-slate-500">{filters.reviewStatuses.join(', ') || 'All'}</p></div>
      </div>
    </Card>
  );
}
