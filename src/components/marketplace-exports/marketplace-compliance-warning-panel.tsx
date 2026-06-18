import { MARKETPLACE_EXPORT_SAFETY_RULES } from '@/domain/amazon-ebay-woocommerce';

export function MarketplaceComplianceWarningPanel() {
  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="text-lg font-semibold">Marketplace safety and compliance language</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        {MARKETPLACE_EXPORT_SAFETY_RULES.map((rule) => <li key={rule}>{rule}</li>)}
      </ul>
    </section>
  );
}
