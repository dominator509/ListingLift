import { Card, CardText, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCents, type PackageQuote } from '@/server/services/pricing-service';

export function CheckoutSummary({ quote }: { quote: PackageQuote }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle>{quote.packageName}</CardTitle>
          <CardText>{quote.imageQuantity} images · {quote.revisionAllowance} included revision rounds</CardText>
        </div>
        <Badge tone={quote.manualQuoteRequired ? 'amber' : 'green'}>{quote.manualQuoteRequired ? 'Operator quote' : 'Checkout-ready'}</Badge>
      </div>
      <p className="mt-5 text-3xl font-bold text-slate-950">{formatCents(quote.estimatedCents, quote.currency)}</p>
      {quote.quoteReasons.length ? (
        <ul className="mt-4 space-y-2 text-sm text-amber-800">
          {quote.quoteReasons.map((reason) => <li key={reason}>• {reason}</li>)}
        </ul>
      ) : null}
      <p className="mt-5 text-xs leading-5 text-slate-500">{quote.safeClaim}</p>
    </Card>
  );
}
