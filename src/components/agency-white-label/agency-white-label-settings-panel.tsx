import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { buildAgencyWhiteLabelSettingsPreview } from '@/server/services/agency-white-label-settings-service';

type SettingsPreview = ReturnType<typeof buildAgencyWhiteLabelSettingsPreview>;

export function AgencyWhiteLabelSettingsPanel({ settings }: { settings: SettingsPreview }) {
  const preview = settings.preview;
  return (
    <Card title="White-label settings" description="Draft brand kit for agency client portal, delivery pages, reports, and support identity.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Portal preview</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{preview.portalName}</p>
          <p className="mt-2 text-sm text-slate-600">Support: {preview.supportEmail}</p>
          <p className="mt-2 text-sm text-slate-600">Domain: {preview.customDomain ?? 'Default ListingLift-hosted domain'}</p>
          <p className="mt-2 text-sm text-slate-600">Footer: {preview.deliveryFooter}</p>
        </div>
        <div className="space-y-3 rounded-xl border border-slate-200 p-4">
          <Badge tone={preview.reviewStatus === 'APPROVED' ? 'green' : preview.reviewStatus === 'REJECTED' ? 'red' : 'amber'}>{preview.reviewStatus}</Badge>
          <p className="text-sm leading-6 text-slate-600">{settings.notices.branding}</p>
          <p className="text-sm leading-6 text-slate-600">{settings.notices.guarantee}</p>
          <p className="text-sm font-medium text-slate-700">ListingLift branding hidden: {preview.hideListingLiftBranding ? 'Yes, after approval' : 'No'}</p>
        </div>
      </div>
    </Card>
  );
}
