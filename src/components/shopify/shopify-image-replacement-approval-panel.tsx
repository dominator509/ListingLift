import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ShopifyImageReplacementApprovalPanel() {
  const statuses = ['NOT_REQUESTED', 'PENDING_MERCHANT_REVIEW', 'APPROVED_FOR_MANUAL_UPLOAD', 'REJECTED', 'REPLACED_MANUALLY', 'CLOSED'];
  return (
    <Card>
      <CardHeader><CardTitle>Product image replacement approval</CardTitle></CardHeader>
      <CardContent className="flex flex-wrap gap-2 text-sm text-slate-600">
        {statuses.map((status) => <span key={status} className="rounded-full border px-3 py-1">{status}</span>)}
        <p className="w-full pt-2">Replacement approval is product-level and must block automated/live product image replacement until explicitly approved.</p>
      </CardContent>
    </Card>
  );
}
