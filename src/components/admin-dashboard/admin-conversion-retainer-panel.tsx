import { Card } from '@/components/ui/card';
import { formatAdminMoneyFromCents } from '@/domain/admin-dashboard-analytics';

type ConversionRow = {
  clientId?: string;
  clientName: string;
  marketplaceSource: string;
  directSource?: string;
  marketplaceOrderCount: number;
  directOrderCount: number;
  grossRevenueCents: number;
  conversionRatioPercent: number;
  safetyNote: string;
};

type RetainerAlertRow = {
  clientId?: string;
  clientName: string;
  sourceChannel?: string;
  completedJobs: number;
  deliveredImages: number;
  score: number;
  priority: string;
  suggestedAction: string;
  safetyNote: string;
};

export function AdminConversionRetainerPanel({ conversions, retainerAlerts }: { conversions: ConversionRow[]; retainerAlerts: RetainerAlertRow[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Marketplace-to-direct conversion signals" description="Internal signals only. No marketplace messaging automation is enabled by this seed.">
        <div className="space-y-3">
          {conversions.map((candidate) => (
            <div key={`${candidate.clientId ?? candidate.clientName}-${candidate.marketplaceSource}`} className="rounded-xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">{candidate.clientName}</p>
              <p className="mt-1 text-sm text-slate-600">{candidate.marketplaceSource} → {candidate.directSource ?? 'Direct'} · {candidate.marketplaceOrderCount} marketplace / {candidate.directOrderCount} direct orders</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{candidate.conversionRatioPercent}% direct mix · {formatAdminMoneyFromCents(candidate.grossRevenueCents)}</p>
            </div>
          ))}
          {!conversions.length ? <p className="text-sm text-slate-600">No conversion candidates in this seeded snapshot.</p> : null}
        </div>
      </Card>
      <Card title="Retainer opportunity alerts" description="Alerts produce manual-review tasks, not automatic client outreach.">
        <div className="space-y-3">
          {retainerAlerts.map((alert) => (
            <div key={alert.clientId ?? alert.clientName} className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{alert.clientName}</p>
                  <p className="mt-1 text-sm text-slate-600">{alert.completedJobs} completed jobs · {alert.deliveredImages} delivered images · {alert.sourceChannel ?? 'manual source'}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{alert.priority} · {alert.score}</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{alert.suggestedAction}</p>
            </div>
          ))}
          {!retainerAlerts.length ? <p className="text-sm text-slate-600">No retainer alerts in this seeded snapshot.</p> : null}
        </div>
      </Card>
    </div>
  );
}
