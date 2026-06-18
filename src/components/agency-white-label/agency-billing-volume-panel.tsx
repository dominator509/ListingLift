import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { buildAgencyVolumePricingQuote } from '@/server/services/agency-billing-service';

type VolumeQuote = ReturnType<typeof buildAgencyVolumePricingQuote>;

export function AgencyBillingVolumePanel({ quote }: { quote: VolumeQuote }) {
  return (
    <Card title="Volume pricing scaffold" description="Agency subscription estimate for multi-client image volume. This is not a charge until verified by billing records and admin approval.">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <p className="text-sm text-slate-500">Tier</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{quote.tierLabel}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Included images</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{quote.includedImages}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Overage images</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{quote.overageImages}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Estimate</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{quote.formattedEstimatedMonthly}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge tone="amber">Manual review</Badge>
        <Badge tone="purple">Dry-run quote</Badge>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{quote.billingNotice}</p>
    </Card>
  );
}
