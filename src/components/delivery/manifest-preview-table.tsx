import { Card } from '@/components/ui/card';
import type { DeliveryArchiveFilePlan } from '@/domain/delivery-packaging';

export function ManifestPreviewTable({ files }: { files: DeliveryArchiveFilePlan[] }) {
  const rows = files.filter((file) => file.kind === 'OUTPUT' || file.kind === 'BEFORE_AFTER').slice(0, 8);
  return (
    <Card title="Manifest preview" description="Manifest rows include source image, output path, preset, dimensions, format, and seller-review status.">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Output</th>
              <th className="px-3 py-2">Preset</th>
              <th className="px-3 py-2">Dimensions</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((file) => (
              <tr key={file.archivePath}>
                <td className="px-3 py-2 font-mono text-xs text-slate-700">{file.archivePath}</td>
                <td className="px-3 py-2">{file.presetKey ?? 'Custom'}</td>
                <td className="px-3 py-2">{file.width ?? '—'} × {file.height ?? '—'}</td>
                <td className="px-3 py-2">{file.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
