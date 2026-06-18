import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function ManualJobForm() {
  return (
    <Card title="Create manual job" description="Use this for direct leads, manual marketplace work, and fallback intake. Codex must wire this to /api/jobs/manual with server-side RBAC and audit logs.">
      <form className="grid gap-4 md:grid-cols-2">
        <Input name="clientName" label="Client name" placeholder="Jane Seller" />
        <Input name="businessName" label="Business/store" placeholder="Jane's Shop" />
        <Input name="title" label="Job title" placeholder="Marketplace Listing Pack — Spring products" />
        <Input name="packageKey" label="Package key" placeholder="marketplace-listing-pack" />
        <Input name="targetPlatform" label="Target platform" placeholder="Amazon, Etsy, Shopify..." />
        <Input name="imageQuantity" label="Image quantity" type="number" placeholder="25" />
        <Select name="priority" label="Priority" options={[{ label: 'Normal', value: 'NORMAL' }, { label: 'High', value: 'HIGH' }, { label: 'Urgent', value: 'URGENT' }, { label: 'Low', value: 'LOW' }]} />
        <Input name="deadline" label="Deadline" type="datetime-local" />
        <Input name="sourceChannelName" label="Source channel" placeholder="manual" />
        <Input name="orderAmount" label="Order amount" type="number" placeholder="149" />
        <label className="md:col-span-2 text-sm font-medium text-slate-700">
          Admin notes
          <textarea name="adminNotes" className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Internal fulfillment notes, source context, manual fallback instructions" />
        </label>
        <div className="md:col-span-2">
          <Button type="button">Create draft job</Button>
          <p className="mt-2 text-xs text-slate-500">Seed UI only. The real submit handler belongs to Codex runtime wiring.</p>
        </div>
      </form>
    </Card>
  );
}
