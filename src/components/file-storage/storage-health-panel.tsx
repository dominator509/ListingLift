export function StorageHealthPanel() {
  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">Storage health checks</h3>
      <p className="mt-2 text-sm text-slate-600">Mock and local providers should pass without third-party credentials. Google Drive and Dropbox require encrypted OAuth references plus enabled feature flags.</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        <li>• Real provider calls disabled by default.</li>
        <li>• Health checks must never expose tokens or secrets.</li>
        <li>• Failed provider health must not block manual upload/download fallback.</li>
      </ul>
    </section>
  );
}
