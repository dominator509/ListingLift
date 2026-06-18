import { buildTaskrabbitDeliveryMessage } from '@/domain/taskrabbit';

export function TaskrabbitDeliveryMessagePanel() {
  const message = buildTaskrabbitDeliveryMessage({ customerName: 'Customer', taskId: 'TR-12345', archiveFileName: 'ListingLift_Delivery.zip', includeExternalLink: true, externalLinkAllowed: true });
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Delivery message template</h2>
      <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm text-slate-100">{message}</pre>
    </section>
  );
}
