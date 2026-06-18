const notifications = [
  { type: 'DOWNLOAD_READY', status: 'PLANNED', provider: 'mock-email' },
  { type: 'DEADLINE_APPROACHING', status: 'PLANNED', provider: 'mock-email' },
  { type: 'FAILED_JOB_ALERT', status: 'PLANNED', provider: 'mock-email' },
];

export function NotificationLogTable() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Notification log</h2>
      <table className="mt-4 w-full text-left text-sm">
        <thead><tr className="border-b text-slate-500"><th className="py-2">Type</th><th>Status</th><th>Provider</th></tr></thead>
        <tbody>{notifications.map((notification) => <tr key={notification.type} className="border-b last:border-0"><td className="py-2 font-medium">{notification.type}</td><td>{notification.status}</td><td>{notification.provider}</td></tr>)}</tbody>
      </table>
    </section>
  );
}
