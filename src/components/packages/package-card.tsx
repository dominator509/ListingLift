import { Badge } from '@/components/ui/badge';
import { Card, CardText, CardTitle } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/button';
import { PriceRange } from './price-range';
import type { ServicePackage } from '@/domain/packages';

export function PackageCard({ pkg }: { pkg: ServicePackage }) {
  return (
    <Card className={pkg.popular ? 'border-blue-300 ring-2 ring-blue-100' : undefined}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle>{pkg.name}</CardTitle>
          <CardText>{pkg.positioning}</CardText>
        </div>
        {pkg.popular ? <Badge tone="blue">Popular</Badge> : null}
      </div>
      <div className="mt-5">
        <PriceRange pkg={pkg} />
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{pkg.checkoutMode.replaceAll('_', ' ')}</p>
      </div>
      <ul className="mt-5 space-y-2 text-sm text-slate-700">
        {pkg.features.slice(0, 7).map((feature) => <li key={feature}>• {feature}</li>)}
      </ul>
      <p className="mt-5 text-xs leading-5 text-slate-500">{pkg.safeClaim}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <LinkButton href={`/checkout/${pkg.key}`}>Start package</LinkButton>
        <LinkButton href={`/packages#${pkg.publicSlug}`} variant="ghost">Details</LinkButton>
      </div>
    </Card>
  );
}
