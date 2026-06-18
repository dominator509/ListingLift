import { EtsyDeliveryTemplatePanel, EtsyRevisionStatusPanel } from '@/components/etsy';

export default function AdminEtsyDeliveryPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Etsy delivery</h1>
        <p className="mt-3 text-slate-600">Generate manual delivery copy and track Etsy revision status after admin approval and archive readiness.</p>
      </div>
      <EtsyDeliveryTemplatePanel />
      <EtsyRevisionStatusPanel />
    </main>
  );
}
