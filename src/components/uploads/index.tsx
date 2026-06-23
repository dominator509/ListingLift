import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type UploadFileRow = {
  fileName: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/heic' | 'application/zip';
  sizeBytes: number;
  width?: number;
  height?: number;
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function UploadTokenStatusCard({ tokenPreview }: { tokenPreview: string }) {
  return (
    <Card
      title="Upload token status"
      description="This page is token-gated. Server-side verification must validate the token before files are accepted."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="green">Token present</Badge>
        <span className="font-mono text-sm text-slate-600">{tokenPreview}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Final delivery remains hidden until admin approval. Raw uploads are preserved and never overwritten.
      </p>
    </Card>
  );
}

export function FileValidationTable({ files }: { files: UploadFileRow[] }) {
  return (
    <Card title="Validation preview" description="Every upload must pass server-side type, size, dimension, and ZIP safety checks.">
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Dimensions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {files.map((file) => (
              <tr key={file.fileName} className="bg-white">
                <td className="px-4 py-3 font-medium text-slate-950">{file.fileName}</td>
                <td className="px-4 py-3 text-slate-600">{file.mimeType}</td>
                <td className="px-4 py-3 text-slate-600">{formatBytes(file.sizeBytes)}</td>
                <td className="px-4 py-3 text-slate-600">
                  {file.width && file.height ? `${file.width} x ${file.height}` : 'ZIP manifest required'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function ZipSafetyPanel() {
  const checks = [
    'Reject path traversal and absolute paths',
    'Reject executable payloads and nested unsafe archives',
    'Preserve every original file before processing',
    'Create a manifest for operator review',
  ];

  return (
    <Card title="ZIP safety" description="Archive handling must be defensive before fulfillment work starts.">
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {checks.map((check) => (
            <div key={check} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700">
              {check}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function UploadIntakeChecklist() {
  const items = [
    ['Token verification', 'Confirm token hash, expiry, tenant, and job binding before accepting files.'],
    ['Original preservation', 'Store raw uploads immutably before processing outputs are generated.'],
    ['Manual fallback', 'Flag validation failures for operator review instead of dropping work silently.'],
    ['Approval gate', 'Keep final downloads hidden until admin approval is recorded.'],
  ] as const;

  return (
    <Card title="Intake checklist" description="These controls keep upload intake aligned with ListingLift fulfillment rules.">
      <div className="grid gap-3">
        {items.map(([title, description]) => (
          <div key={title} className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-950">{title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
