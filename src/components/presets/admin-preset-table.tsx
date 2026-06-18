import { Badge } from '@/components/ui/badge';
import type { PlatformPreset } from '@/domain/platform-presets';

export function AdminPresetTable({ presets }: { presets: PlatformPreset[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Preset</th>
            <th className="px-4 py-3">Output</th>
            <th className="px-4 py-3">Folder</th>
            <th className="px-4 py-3">Safety</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {presets.map((preset) => (
            <tr key={preset.key}>
              <td className="px-4 py-4">
                <div className="font-semibold text-slate-950">{preset.name}</div>
                <div className="text-xs text-slate-500">{preset.key}</div>
              </td>
              <td className="px-4 py-4 text-slate-700">{preset.width}×{preset.height} · {preset.format}</td>
              <td className="px-4 py-4 font-mono text-xs text-slate-600">{preset.folderPath}</td>
              <td className="px-4 py-4 text-xs text-slate-600">{preset.safeLanguage}</td>
              <td className="px-4 py-4"><Badge tone={preset.active ? 'green' : 'slate'}>{preset.active ? 'Active' : 'Inactive'}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
