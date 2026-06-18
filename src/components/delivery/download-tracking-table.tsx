const rows = [
  { event: 'TOKEN_RESOLVED', status: 'Allowed', at: 'Pending runtime data' },
  { event: 'DOWNLOAD_STARTED', status: 'Tracked', at: 'Pending runtime data' },
  { event: 'DOWNLOAD_DENIED', status: 'Audited', at: 'Pending runtime data' },
];

export function DownloadTrackingTable() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Download tracking</h2>
      <table className="mt-4 w-full text-left text-sm">
        <thead><tr className="border-b text-slate-500"><th className="py-2">Event</th><th>Status</th><th>Time</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.event} className="border-b last:border-0"><td className="py-2 font-medium">{row.event}</td><td>{row.status}</td><td>{row.at}</td></tr>)}</tbody>
      </table>
    </section>
  );
}
