import { formatPackagePrice, type ServicePackage } from '@/domain/packages';

export function PriceRange({ pkg, className }: { pkg: Pick<ServicePackage, 'priceMinCents' | 'priceMaxCents' | 'billingInterval'>; className?: string }) {
  return <p className={className ?? 'text-3xl font-bold text-slate-950'}>{formatPackagePrice(pkg)}</p>;
}
