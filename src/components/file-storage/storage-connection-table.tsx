type ConnectionRow = { id: string; provider: string; status: string; displayName: string; updatedAt?: string };

export function StorageConnectionTable({ rows = [] }: { rows?: ConnectionRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Name</th><th className="p-3">Provider</th><th className="p-3">Status</th><th className="p-3">Updated</th></tr></thead>
        <tbody>{rows.length ? rows.map((row) => <tr key={row.id} className="border-t"><td className="p-3 font-medium">{row.displayName}</td><td className="p-3">{row.provider}</td><td className="p-3">{row.status}</td><td className="p-3 text-slate-500">{row.updatedAt ?? 'Not connected'}</td></tr>) : <tr><td colSpan={4} className="p-6 text-center text-slate-500">No storage connections configured yet.</td></tr>}</tbody>
      </table>
    </div>
  );
}
