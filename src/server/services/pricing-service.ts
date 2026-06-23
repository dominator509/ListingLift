import { requirePackageByKey, assertPackageAllowance } from './package-service';
import { packageQuoteRequestSchema, type PackageQuoteRequest } from '@/schemas/package';

export type PackageQuote = {
  packageKey: string;
  packageName: string;
  currency: 'USD';
  minCents: number | null;
  maxCents: number | null;
  estimatedCents: number | null;
  overageCents: number;
  manualQuoteRequired: boolean;
  quoteReasons: string[];
  imageQuantity: number;
  imageAllowance: number | null;
  revisionAllowance: number;
  checkoutMode: string;
  safeClaim: string;
};

function midpoint(min: number | null, max: number | null) {
  if (min == null && max == null) return null;
  if (min != null && max == null) return min;
  if (min == null && max != null) return max;
  return Math.round(((min as number) + (max as number)) / 2);
}

export function buildPackageQuote(input: PackageQuoteRequest): PackageQuote {
  const data = packageQuoteRequestSchema.parse(input);
  const pkg = requirePackageByKey(data.packageKey);
  const allowance = assertPackageAllowance(pkg, data.imageQuantity);
  const quoteReasons: string[] = [];
  let manualQuoteRequired = pkg.checkoutMode !== 'direct_checkout' || pkg.manualReviewRequired;

  if (!allowance.allowed) {
    manualQuoteRequired = true;
    quoteReasons.push(allowance.message);
  }
  if (data.needsBrandBackgrounds && pkg.category !== 'product_launch' && pkg.category !== 'agency') {
    manualQuoteRequired = true;
    quoteReasons.push('Brand-color backgrounds require operator review unless already included in the selected package.');
  }
  if (data.needsManualEditing) {
    manualQuoteRequired = true;
    quoteReasons.push('Manual cleanup or Photoshop/Canva replacement requires operator review.');
  }
  if (data.rushRequested && !pkg.pricePolicy.rushAvailable) {
    manualQuoteRequired = true;
    quoteReasons.push('Rush turnaround is not available as an automatic checkout option for this package.');
  }

  const baseEstimate = midpoint(pkg.priceMinCents, pkg.priceMaxCents);
  const overageImages = pkg.imageAllowance != null ? Math.max(0, data.imageQuantity - pkg.imageAllowance) : 0;
  const overageCents = pkg.pricePolicy.overagePriceCents != null ? overageImages * pkg.pricePolicy.overagePriceCents : 0;
  const rushCents = data.rushRequested && pkg.pricePolicy.rushAvailable ? pkg.pricePolicy.rushFeeCents ?? 0 : 0;
  const estimatedCents = baseEstimate == null ? null : baseEstimate + overageCents + rushCents;

  return {
    packageKey: pkg.key,
    packageName: pkg.name,
    currency: pkg.currency,
    minCents: pkg.priceMinCents,
    maxCents: pkg.priceMaxCents,
    estimatedCents,
    overageCents,
    manualQuoteRequired,
    quoteReasons: quoteReasons.filter(Boolean),
    imageQuantity: data.imageQuantity,
    imageAllowance: pkg.imageAllowance,
    revisionAllowance: pkg.revisionAllowance,
    checkoutMode: manualQuoteRequired ? 'manual_quote' : pkg.checkoutMode,
    safeClaim: pkg.safeClaim,
  };
}

export function formatCents(cents: number | null, currency = 'USD') {
  if (cents == null) return 'Custom quote';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(cents / 100);
}
