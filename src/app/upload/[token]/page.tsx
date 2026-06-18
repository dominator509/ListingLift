import { PublicShell } from '@/components/layout/public-shell';
import { UploadDropzone } from '@/components/workflow/upload-dropzone';
import { FileValidationTable, UploadIntakeChecklist, UploadTokenStatusCard, ZipSafetyPanel } from '@/components/uploads';
import { notFound } from 'next/navigation';

const sampleFiles = [
  { fileName: 'raw-product-front.jpg', mimeType: 'image/jpeg' as const, sizeBytes: 2_400_000, width: 2400, height: 2400 },
  { fileName: 'product-batch.zip', mimeType: 'application/zip' as const, sizeBytes: 12_000_000 },
];

export default function UploadTokenPage({ params }: { params: { token: string } }) {
  const token = params?.token;
  if (!token || typeof token !== 'string') return notFound();

  return (
    <PublicShell>
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Secure upload</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">Upload product photos</h1>
          <p className="mt-4 max-w-3xl text-slate-600">Upload raw product photos or a ZIP for your ListingLift job. Files are validated before fulfillment and original uploads are preserved.</p>
        </div>
        <div className="grid gap-6">
          <UploadTokenStatusCard tokenPreview={`${token.slice(0, 8)}...`} />
          <UploadDropzone description="Phase 8 seed: Codex must wire this shell to server-side token verification, storage, upload history, and transactional Image records." />
          <FileValidationTable files={sampleFiles} />
          <ZipSafetyPanel />
          <UploadIntakeChecklist />
        </div>
      </section>
    </PublicShell>
  );
}
