import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

type SharedPortalRow = { id: string; label: string; status: string; clientName: string; maxFiles: number; allowedUploadKinds: string[]; expiresAt: string };

export function SharedUploadPortalPanel({ portals }: { portals: SharedPortalRow[] }) {
  return (
    <Card title="Shared upload portals" description="Portal links are API-adjacent intake scaffolds for agencies and automations. Tokens are shown once, hashed, scoped, expiring, and original-preserving.">
      <div className="space-y-3">
        {portals.map((portal) => (
          <div key={portal.id} className="rounded-xl border border-slate-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-950">{portal.label}</p>
                <p className="mt-1 text-sm text-slate-600">{portal.clientName} · max {portal.maxFiles} files</p>
              </div>
              <Badge tone="amber">{portal.status}</Badge>
            </div>
            <p className="mt-2 text-xs text-slate-500">Allowed: {portal.allowedUploadKinds.join(', ')} · Expires {new Date(portal.expiresAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
