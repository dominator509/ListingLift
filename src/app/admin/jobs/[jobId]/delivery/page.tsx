import { DeliveryArchivePanel } from '@/components/delivery';

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">Job {jobId}</p>
        <h1 className="text-3xl font-semibold text-slate-950">Delivery archive planning</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Phase 12 seeds smart naming, preset-generated folders, manifest rows, ReadMe safety copy, and ZIP archive planning. Codex must connect this page to real approved processed files and storage before any client-facing download is enabled.
        </p>
      </div>
      <DeliveryArchivePanel />
    </main>
  );
}
