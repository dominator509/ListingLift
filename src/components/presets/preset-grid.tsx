import type { PlatformPreset } from '@/domain/platform-presets';
import { PresetCard } from './preset-card';

export function PresetGrid({ presets }: { presets: PlatformPreset[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {presets.map((preset) => (
        <PresetCard key={preset.key} preset={preset} />
      ))}
    </div>
  );
}
