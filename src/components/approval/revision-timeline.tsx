type Event = { id: string; label: string; detail: string; createdAt: string };
export function RevisionTimeline({ events }: { events: Event[] }) {
  return <section className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold text-slate-950">Revision timeline</h2><ol className="mt-4 space-y-3">{events.map((event) => <li key={event.id} className="rounded-xl border bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-900">{event.label}</p><p className="mt-1 text-sm text-slate-600">{event.detail}</p><p className="mt-2 text-xs text-slate-400">{event.createdAt}</p></li>)}</ol></section>;
}
