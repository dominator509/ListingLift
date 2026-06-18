import { evaluateSecurityUploadProbe, evaluateSecurityZipProbe } from '@/server/services/security-upload-guard-service';

export function UploadSecurityPanel() {
  const safeImage = evaluateSecurityUploadProbe({ fileName: 'sku-123-main.jpg', mimeType: 'image/jpeg', sizeBytes: 2_400_000, width: 1600, height: 1600, sourceSurface: 'CLIENT_DASHBOARD' });
  const rejectedFile = evaluateSecurityUploadProbe({ fileName: '../payload.exe', mimeType: 'application/x-msdownload', sizeBytes: 90_000, sourceSurface: 'PUBLIC_UPLOAD' });
  const zipProbe = evaluateSecurityZipProbe([
    { path: 'products/sku-123-front.png', sizeBytes: 500_000, isDirectory: false },
    { path: '../../escape.sh', sizeBytes: 200, isDirectory: false },
  ]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Upload and ZIP safety</h2>
      <p className="mt-1 text-sm text-slate-600">Scaffolded probes reject unsafe MIME types, executable/script-like extensions, traversal names, oversized files, and ZIP slip paths.</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-950">Safe image probe</p>
          <p className="mt-2 text-sm text-slate-600">Accepted: {safeImage.accepted ? 'yes' : 'no'}</p>
          <p className="text-xs text-slate-500">Parseability and tenant/job scope remain Codex runtime checks.</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-950">Rejected executable probe</p>
          <p className="mt-2 text-sm text-slate-600">Accepted: {rejectedFile.accepted ? 'yes' : 'no'}</p>
          <p className="text-xs text-slate-500">Issues: {rejectedFile.issues.map((issue) => issue.code).join(', ')}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-950">ZIP slip probe</p>
          <p className="mt-2 text-sm text-slate-600">Rejected entries: {zipProbe.rejectedEntries.length}</p>
          <p className="text-xs text-slate-500">Nested archives and traversal paths must be blocked before extraction.</p>
        </div>
      </div>
    </section>
  );
}
