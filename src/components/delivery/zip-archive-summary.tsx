import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function ZipArchiveSummary({ fileCount, outputCount, missingCount, zipFileName }: { fileCount: number; outputCount: number; missingCount: number; zipFileName: string }) {
  return (
    <Card title="ZIP archive summary" description="Final downloads must remain hidden until admin approval and delivery visibility checks pass.">
      <dl className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 p-3"><dt className="text-xs text-slate-500">ZIP</dt><dd className="mt-1 font-mono text-xs text-slate-800">{zipFileName}</dd></div>
        <div className="rounded-xl border border-slate-200 p-3"><dt className="text-xs text-slate-500">Files</dt><dd className="mt-1 text-lg font-semibold">{fileCount}</dd></div>
        <div className="rounded-xl border border-slate-200 p-3"><dt className="text-xs text-slate-500">Outputs</dt><dd className="mt-1 text-lg font-semibold">{outputCount}</dd></div>
        <div className="rounded-xl border border-slate-200 p-3"><dt className="text-xs text-slate-500">Missing</dt><dd className="mt-1"><Badge tone={missingCount ? 'red' : 'green'}>{missingCount}</Badge></dd></div>
      </dl>
    </Card>
  );
}
