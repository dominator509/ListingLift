import { PublicShell } from '@/components/layout/public-shell';
import { DeliveryDownloadCard } from '@/components/delivery/delivery-download-card';
import { DownloadSecurityPanel } from '@/components/delivery/download-security-panel';
import { notFound } from 'next/navigation';

export default function DeliveryTokenPage({ params }: { params: { token: string } }) {
  const token = params?.token;
  if (!token || typeof token !== 'string') return notFound();

  return (
    <PublicShell>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">ListingLift delivery</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-950">Secure download page</h1>
        <p className="mt-4 text-slate-600">Token ending <code>{token.slice(-6)}</code>. Runtime access must be resolved server-side from the hashed token.</p>
        <div className="mt-8 grid gap-6">
          <DeliveryDownloadCard fileName="ListingLift_Delivery_Client_Job.zip" expiresAt="Pending runtime token" allowed={false} blockers={['Codex must resolve this token against the database before enabling downloads.']} />
          <DownloadSecurityPanel />
        </div>
      </section>
    </PublicShell>
  );
}
