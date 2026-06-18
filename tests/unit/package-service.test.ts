import { describe, expect, it } from 'vitest';
import { REQUIRED_PACKAGE_KEYS } from '@/domain/database-keys';
import { DEFAULT_PACKAGES } from '@/domain/packages';
import { assertPackageAllowance, assertRevisionAllowance, buildSalesChannelPackageMap, listDefaultPackages } from '@/server/services/package-service';

const packages = listDefaultPackages();

describe('package service contract', () => {
  it('contains every required package key as a data-driven record', () => {
    expect(packages.map((pkg) => pkg.key).sort()).toEqual([...REQUIRED_PACKAGE_KEYS].sort());
  });

  it('uses safe marketplace language and never guarantees compliance or sales outcomes', () => {
    for (const pkg of packages) {
      expect(pkg.safeClaim).toMatch(/platform-ready drafts/i);
      expect(pkg.safeClaim).toMatch(/seller review/i);
      expect(pkg.safeClaim).not.toMatch(/guarantee(d)? amazon compliance|guarantee(d)? sales|guarantee(d)? ranking/i);
    }
  });

  it('keeps price ranges inside the architecture-approved ranges', () => {
    const quick = packages.find((pkg) => pkg.key === 'QuickCleanup10');
    expect(quick?.priceMinCents).toBe(2500);
    expect(quick?.priceMaxCents).toBe(4900);

    const agency = packages.find((pkg) => pkg.key === 'AgencyWhiteLabel');
    expect(agency?.priceMinCents).toBe(100000);
    expect(agency?.priceMaxCents).toBe(300000);
  });

  it('enforces image and revision allowance contracts before checkout/job creation', () => {
    const quick = DEFAULT_PACKAGES.find((pkg) => pkg.key === 'QuickCleanup10');
    expect(quick).toBeTruthy();
    expect(assertPackageAllowance(quick!, 10).allowed).toBe(true);
    expect(assertPackageAllowance(quick!, 16).allowed).toBe(false);
    expect(assertRevisionAllowance(quick!, 1)).toBe(true);
    expect(assertRevisionAllowance(quick!, 2)).toBe(false);
  });

  it('maps sales channels to packages for normalization without hardcoding only UI cards', () => {
    const map = buildSalesChannelPackageMap();
    expect(map.some((entry) => entry.salesChannelKey === 'Fiverr' && entry.packageKey === 'QuickCleanup10')).toBe(true);
    expect(map.some((entry) => entry.salesChannelKey === 'Upwork' && entry.packageKey === 'MonthlySellerRetainer')).toBe(true);
  });
});
