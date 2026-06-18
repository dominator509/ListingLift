import { DEFAULT_PACKAGES, findDefaultPackage, formatPackagePrice, type ServicePackage } from '@/domain/packages';
import { packageAdminUpdateSchema, packageSchema, type PackageAdminUpdateInput } from '@/schemas/package';

export function listDefaultPackages(options: { activeOnly?: boolean; publicOnly?: boolean } = {}) {
  const packages = DEFAULT_PACKAGES.map((pkg) => packageSchema.parse(pkg)).sort((a, b) => a.sortOrder - b.sortOrder);
  return packages.filter((pkg) => {
    if (options.activeOnly && !pkg.active) return false;
    if (options.publicOnly && pkg.key === 'Custom') return false;
    return true;
  });
}

export function listPublicPackages() {
  return listDefaultPackages({ activeOnly: true, publicOnly: true });
}

export function findPackageByKey(keyOrSlug: string) {
  const found = findDefaultPackage(keyOrSlug);
  return found ? packageSchema.parse(found) : null;
}

export function requirePackageByKey(keyOrSlug: string) {
  const pkg = findPackageByKey(keyOrSlug);
  if (!pkg) throw new Error(`Unknown package: ${keyOrSlug}`);
  return pkg;
}

export function getPackageDisplayPrice(pkg: Pick<ServicePackage, 'priceMinCents' | 'priceMaxCents' | 'billingInterval'>) {
  return formatPackagePrice(pkg);
}

export function assertPackageAllowance(pkg: Pick<ServicePackage, 'key' | 'imageMax' | 'imageAllowance' | 'pricePolicy'>, imageQuantity: number) {
  if (!Number.isInteger(imageQuantity) || imageQuantity <= 0) throw new Error('Image quantity must be a positive integer.');
  const manualThreshold = pkg.pricePolicy.requiresManualQuoteAboveImages;
  if (manualThreshold != null && imageQuantity > manualThreshold) {
    return { allowed: false, reason: 'manual_quote_required', message: 'This image quantity requires an operator-reviewed manual quote.' } as const;
  }
  if (pkg.imageMax != null && imageQuantity > pkg.imageMax && manualThreshold == null) {
    return { allowed: false, reason: 'package_allowance_exceeded', message: 'Image quantity exceeds this package allowance.' } as const;
  }
  return { allowed: true, reason: null, message: null } as const;
}

export function assertRevisionAllowance(pkg: Pick<ServicePackage, 'revisionAllowance'>, requestedRevisions: number) {
  if (!Number.isInteger(requestedRevisions) || requestedRevisions < 0) throw new Error('Requested revisions must be a non-negative integer.');
  return requestedRevisions <= pkg.revisionAllowance;
}

export function buildPackageAdminDraft(input: PackageAdminUpdateInput) {
  const update = packageAdminUpdateSchema.parse(input);
  return {
    ...update,
    auditAction: 'package.update.requested',
    auditReason: update.changeReason,
    requiresPermission: 'manage:packages',
  };
}

export function buildSalesChannelPackageMap() {
  return listDefaultPackages({ activeOnly: true }).flatMap((pkg) =>
    pkg.defaultSalesChannelKeys.map((salesChannelKey) => ({
      packageKey: pkg.key,
      packageName: pkg.name,
      salesChannelKey,
      checkoutMode: pkg.checkoutMode,
    })),
  );
}
