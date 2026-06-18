import { UpworkDeliveryTemplatePanel, UpworkSafetyPanel } from '@/components/upwork';

export default function UpworkDeliveryPage() {
  return <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10"><h1 className="text-3xl font-bold text-slate-950">Upwork delivery</h1><UpworkDeliveryTemplatePanel /><UpworkSafetyPanel /></main>;
}
