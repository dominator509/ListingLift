const rows = [
  { title: 'Delivery summary', status: 'Draft', audience: 'Client' },
  { title: 'Image quality report', status: 'Needs approval', audience: 'Admin' },
  { title: 'Monthly cleanup report', status: 'Draft', audience: 'Client' },
];

export function ReportTable() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr><th className="p-3">Report</th><th className="p-3">Audience</th><th className="p-3">Status</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.title} className="border-t"><td className="p-3 font-medium">{row.title}</td><td className="p-3">{row.audience}</td><td className="p-3">{row.status}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
