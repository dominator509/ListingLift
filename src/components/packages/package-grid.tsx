import { listPublicPackages } from '@/server/services/package-service';
import { PackageCard } from './package-card';

export function PackageGrid() {
  const packages = listPublicPackages();
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => <PackageCard key={pkg.key} pkg={pkg} />)}
    </div>
  );
}
