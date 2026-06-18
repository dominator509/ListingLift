export type DeliveryDownloadCardProps = {
  fileName: string;
  expiresAt: string;
  downloadsRemaining?: number | null;
  allowed: boolean;
  blockers?: string[];
};

export function DeliveryDownloadCard({ fileName, expiresAt, downloadsRemaining, allowed, blockers = [] }: DeliveryDownloadCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Secure delivery</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950">{fileName}</h2>
      <p className="mt-2 text-sm text-slate-600">Expires {expiresAt}. {downloadsRemaining === null || downloadsRemaining === undefined ? 'Download limits are managed by ListingLift.' : `${downloadsRemaining} download(s) remaining.`}</p>
      {allowed ? (
        <button className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Download ZIP</button>
      ) : (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Download is not available yet.</p>
          <ul className="mt-2 list-disc pl-5">
            {blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
          </ul>
        </div>
      )}
      <p className="mt-5 text-xs text-slate-500">Files are platform-ready drafts. Seller review against current marketplace guidelines is recommended before publishing.</p>
    </div>
  );
}
