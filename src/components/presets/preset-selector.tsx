import { Badge } from '@/components/ui/badge';
import { Card, CardText, CardTitle } from '@/components/ui/card';
import type { PresetSelectorOption } from '@/domain/platform-presets';

export function PresetSelector({ options }: { options: PresetSelectorOption[] }) {
  return (
    <Card>
      <CardTitle>Preset selector</CardTitle>
      <CardText>Operators choose data-driven output presets before processing. Client-facing final downloads stay hidden until approval.</CardText>
      <div className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200">
        {options.map((option) => (
          <label key={option.key} className="flex cursor-pointer items-start gap-3 p-4 hover:bg-slate-50">
            <input className="mt-1 h-4 w-4 rounded border-slate-300" type="checkbox" name="presetKeys" value={option.key} />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2 font-semibold text-slate-950">
                {option.label}
                <Badge tone="purple">{option.format}</Badge>
              </span>
              <span className="mt-1 block text-sm text-slate-600">{option.dimensions} · {option.folderPath}</span>
              <span className="mt-1 block text-xs text-slate-500">{option.safeLanguage}</span>
            </span>
          </label>
        ))}
      </div>
    </Card>
  );
}
