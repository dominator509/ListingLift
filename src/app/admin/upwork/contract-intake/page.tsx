import { UpworkManualContractForm, UpworkOfferMappingTable } from '@/components/upwork';

export default function UpworkContractIntakePage() {
  return <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10"><h1 className="text-3xl font-bold text-slate-950">Upwork contract intake</h1><UpworkManualContractForm /><UpworkOfferMappingTable /></main>;
}
