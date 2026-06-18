import { OTHER_SALES_CHANNEL_SAFETY_RULES } from '@/domain/generic-sales-channels';

export function GenericSalesChannelSafetyPanel() {
  return (
    <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-red-950">Safety rules</h2>
      <ul className="mt-4 grid gap-2 text-sm text-red-900 md:grid-cols-2">
        {OTHER_SALES_CHANNEL_SAFETY_RULES.map((rule) => <li key={rule}>• {rule}</li>)}
      </ul>
    </section>
  );
}
