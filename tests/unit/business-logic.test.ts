import { describe, expect, it } from 'vitest';
import { buildPackageQuote, formatCents } from '../../src/server/services/pricing-service';
import { assertPackageAllowance, assertRevisionAllowance } from '../../src/server/services/package-service';
import { evaluatePermission, evaluateTenantAccess } from '../../src/server/services/rbac-policy-service';
import { PERMISSIONS } from '../../src/domain/permissions';
import type { ServicePackage } from '../../src/domain/packages';

// ─── Pricing: buildPackageQuote — comprehensive edge cases ──────────

describe('buildPackageQuote — direct checkout packages', () => {
  it('produces direct checkout for MarketplaceListing25 within allowance', () => {
    const q = buildPackageQuote({ packageKey: 'MarketplaceListing25', imageQuantity: 25, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false });
    expect(q.manualQuoteRequired).toBe(false);
    expect(q.checkoutMode).toBe('direct_checkout');
    expect(q.estimatedCents).toBeGreaterThan(0);
    expect(q.imageAllowance).toBe(25);
    expect(q.revisionAllowance).toBe(2);
  });

  it('produces direct checkout for QuickCleanup10 within allowance', () => {
    const q = buildPackageQuote({ packageKey: 'QuickCleanup10', imageQuantity: 10, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false });
    expect(q.manualQuoteRequired).toBe(false);
    expect(q.checkoutMode).toBe('direct_checkout');
  });
});

describe('buildPackageQuote — manual quote triggers', () => {
  it('requires manual quote when image quantity exceeds threshold', () => {
    const q = buildPackageQuote({ packageKey: 'QuickCleanup10', imageQuantity: 20, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false });
    expect(q.manualQuoteRequired).toBe(true);
    expect(q.checkoutMode).toBe('manual_quote');
    expect(q.quoteReasons.some(r => r.toLowerCase().includes('manual quote'))).toBe(true);
  });

  it('requires manual quote for brand backgrounds on non-launch/agency packages', () => {
    const q = buildPackageQuote({ packageKey: 'MarketplaceListing25', imageQuantity: 25, rushRequested: false, needsBrandBackgrounds: true, needsManualEditing: false });
    expect(q.manualQuoteRequired).toBe(true);
    expect(q.quoteReasons.some(r => r.toLowerCase().includes('background'))).toBe(true);
  });

  it('allows brand backgrounds for product_launch package', () => {
    const q = buildPackageQuote({ packageKey: 'ProductLaunch50', imageQuantity: 50, rushRequested: false, needsBrandBackgrounds: true, needsManualEditing: false });
    // ProductLaunch50 is manual_quote by default anyway
    expect(q.manualQuoteRequired).toBe(true);
  });

  it('requires manual quote when manual editing is requested', () => {
    const q = buildPackageQuote({ packageKey: 'QuickCleanup10', imageQuantity: 10, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: true });
    expect(q.manualQuoteRequired).toBe(true);
    expect(q.quoteReasons.some(r => r.toLowerCase().includes('manual'))).toBe(true);
  });

  it('requires manual quote when rush is requested but not available', () => {
    const q = buildPackageQuote({ packageKey: 'QuickCleanup10', imageQuantity: 10, rushRequested: true, needsBrandBackgrounds: false, needsManualEditing: false });
    expect(q.manualQuoteRequired).toBe(true);
    expect(q.quoteReasons.some(r => r.toLowerCase().includes('rush'))).toBe(true);
  });

  it('launch packages are manual_quote by default', () => {
    expect(buildPackageQuote({ packageKey: 'ProductLaunch50', imageQuantity: 50, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false }).checkoutMode).toBe('manual_quote');
    expect(buildPackageQuote({ packageKey: 'ProductLaunch100', imageQuantity: 100, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false }).checkoutMode).toBe('manual_quote');
  });

  it('agency white-label is volume_quote', () => {
    const q = buildPackageQuote({ packageKey: 'AgencyWhiteLabel', imageQuantity: 500, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false });
    expect(q.checkoutMode).toMatch(/volume_quote|manual_quote/);
  });

  it('custom package has null pricing and manual quote', () => {
    const q = buildPackageQuote({ packageKey: 'Custom', imageQuantity: 10, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false });
    expect(q.minCents).toBeNull();
    expect(q.maxCents).toBeNull();
    expect(q.estimatedCents).toBeNull();
    expect(q.manualQuoteRequired).toBe(true);
  });
});

describe('buildPackageQuote — pricing calculations', () => {
  it('estimates midpoint price for fixed-range package', () => {
    const q = buildPackageQuote({ packageKey: 'MarketplaceListing25', imageQuantity: 25, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false });
    // 9900-14900 midpoint = 12400
    expect(q.estimatedCents).toBe(12400);
    expect(q.minCents).toBe(9900);
    expect(q.maxCents).toBe(14900);
  });

  it('adds overage costs beyond image allowance', () => {
    // QuickCleanup10 allowance=10, overage=500/extra image
    const q = buildPackageQuote({ packageKey: 'QuickCleanup10', imageQuantity: 12, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false });
    // base=3700 (midpoint of 2500-4900), overage=2*500=1000
    expect(q.estimatedCents).toBe(4700);
  });

  it('adds rush fee when rush available', () => {
    // MarketplaceListing25 rushFeeCents=4900
    const q = buildPackageQuote({ packageKey: 'MarketplaceListing25', imageQuantity: 25, rushRequested: true, needsBrandBackgrounds: false, needsManualEditing: false });
    // midpoint=12400, rush=4900
    expect(q.estimatedCents).toBe(17300);
  });

  it('no overage when image quantity equals allowance', () => {
    // MarketplaceListing25 allowance=25
    const q = buildPackageQuote({ packageKey: 'MarketplaceListing25', imageQuantity: 25, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false });
    expect(q.estimatedCents).toBe(12400);
  });

  it('no overage when image allowance is null', () => {
    const q = buildPackageQuote({ packageKey: 'MonthlySellerRetainer', imageQuantity: 100, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false });
    expect(q.overageCents ?? 0).toBe(0);
  });

  it('includes safe claim language', () => {
    const q = buildPackageQuote({ packageKey: 'MarketplaceListing25', imageQuantity: 25, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false });
    expect(q.safeClaim).toContain('not guaranteed');
  });
});

describe('formatCents', () => {
  it('formats USD cents as dollar string', () => {
    expect(formatCents(14900)).toBe('$149');
    expect(formatCents(9900)).toBe('$99');
    expect(formatCents(0)).toBe('$0');
    expect(formatCents(500)).toBe('$5');
  });

  it('returns custom quote for null', () => {
    expect(formatCents(null)).toBe('Custom quote');
  });

  it('rounds to nearest dollar', () => {
    expect(formatCents(14999)).toBe('$150');
    expect(formatCents(14949)).toBe('$149');
  });
});

// ─── Package Service: assertPackageAllowance ────────────────────────

describe('assertPackageAllowance', () => {
  const pkg = {
    key: 'QuickCleanup10',
    imageMax: 10,
    imageAllowance: 10,
    pricePolicy: {
      requiresManualQuoteAboveImages: 15,
      overagePriceCents: 500,
      baseImageAllowance: 10,
      rushAvailable: false,
      rushFeeCents: null,
    },
  } satisfies Pick<ServicePackage, 'key' | 'imageMax' | 'imageAllowance' | 'pricePolicy'>;

  it('allows image quantity at or below max', () => {
    expect(assertPackageAllowance(pkg, 10).allowed).toBe(true);
    expect(assertPackageAllowance(pkg, 5).allowed).toBe(true);
  });

  it('rejects non-positive image quantity', () => {
    expect(() => assertPackageAllowance(pkg, 0)).toThrow('positive integer');
    expect(() => assertPackageAllowance(pkg, -1)).toThrow('positive integer');
  });

  it('rejects non-integer image quantity', () => {
    expect(() => assertPackageAllowance(pkg, 1.5)).toThrow('positive integer');
  });

  it('requires manual quote above threshold', () => {
    const result = assertPackageAllowance(pkg, 20);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('manual_quote_required');
  });

  it('allows image quantity equal to manual threshold', () => {
    expect(assertPackageAllowance(pkg, 15).allowed).toBe(true);
  });

  it('checks imageMax when no manual threshold', () => {
    const limitedPkg = { ...pkg, pricePolicy: { ...pkg.pricePolicy, requiresManualQuoteAboveImages: null } };
    // imageMax=10, quantity=12 -> not allowed
    const result = assertPackageAllowance(limitedPkg, 12);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('package_allowance_exceeded');
  });

  it('allows image at imageMax when no manual threshold', () => {
    const limitedPkg = { ...pkg, pricePolicy: { ...pkg.pricePolicy, requiresManualQuoteAboveImages: null } };
    expect(assertPackageAllowance(limitedPkg, 10).allowed).toBe(true);
  });
});

describe('assertRevisionAllowance', () => {
  const pkg = { revisionAllowance: 2 };

  it('accepts revisions within allowance', () => {
    expect(assertRevisionAllowance(pkg, 0)).toBe(true);
    expect(assertRevisionAllowance(pkg, 1)).toBe(true);
    expect(assertRevisionAllowance(pkg, 2)).toBe(true);
  });

  it('rejects revisions exceeding allowance', () => {
    expect(assertRevisionAllowance(pkg, 3)).toBe(false);
  });

  it('rejects negative revision count', () => {
    expect(() => assertRevisionAllowance(pkg, -1)).toThrow('non-negative integer');
  });

  it('rejects non-integer revision count', () => {
    expect(() => assertRevisionAllowance(pkg, 1.5)).toThrow('non-negative integer');
  });
});

// ─── RBAC: evaluatePermission — comprehensive ───────────────────────

describe('evaluatePermission — role-level access', () => {
  const scope = (role: string, clientId?: string) => ({ organizationId: 'org_1', role: role as any, clientId: clientId ?? null });

  it('grants super admin all permissions', () => {
    const allPerms = Object.values(PERMISSIONS);
    for (const perm of allPerms) {
      expect(evaluatePermission(scope('SUPER_ADMIN'), perm).allowed).toBe(true);
    }
  });

  it('grants operator manageJobs', () => {
    expect(evaluatePermission(scope('OPERATOR'), PERMISSIONS.manageJobs).allowed).toBe(true);
  });

  it('grants operator viewRevenue', () => {
    expect(evaluatePermission(scope('OPERATOR'), PERMISSIONS.viewRevenue).allowed).toBe(true);
  });

  it('denies operator manageSecurity', () => {
    expect(evaluatePermission(scope('OPERATOR'), PERMISSIONS.manageSecurity).allowed).toBe(false);
  });

  it('denies operator manageIntegrations', () => {
    expect(evaluatePermission(scope('OPERATOR'), PERMISSIONS.manageIntegrations).allowed).toBe(false);
  });

  it('grants agency admin manageClients', () => {
    expect(evaluatePermission(scope('AGENCY_ADMIN'), PERMISSIONS.manageClients).allowed).toBe(true);
  });

  it('grants agency admin manageTeam', () => {
    expect(evaluatePermission(scope('AGENCY_ADMIN'), PERMISSIONS.manageTeam).allowed).toBe(true);
  });

  it('denies agency admin approveOutputs', () => {
    expect(evaluatePermission(scope('AGENCY_ADMIN'), PERMISSIONS.approveOutputs).allowed).toBe(false);
  });

  it('grants client owner uploadImages, requestRevisions, downloadFiles, manageBilling', () => {
    expect(evaluatePermission(scope('CLIENT_OWNER'), PERMISSIONS.uploadImages).allowed).toBe(true);
    expect(evaluatePermission(scope('CLIENT_OWNER'), PERMISSIONS.requestRevisions).allowed).toBe(true);
    expect(evaluatePermission(scope('CLIENT_OWNER'), PERMISSIONS.downloadFiles).allowed).toBe(true);
    expect(evaluatePermission(scope('CLIENT_OWNER'), PERMISSIONS.manageBilling).allowed).toBe(true);
  });

  it('denies client owner manageJobs', () => {
    expect(evaluatePermission(scope('CLIENT_OWNER'), PERMISSIONS.manageJobs).allowed).toBe(false);
  });

  it('blocks client viewer from uploadImages, manageBilling, requestRevisions', () => {
    expect(evaluatePermission(scope('CLIENT_VIEWER'), PERMISSIONS.uploadImages).allowed).toBe(false);
    expect(evaluatePermission(scope('CLIENT_VIEWER'), PERMISSIONS.manageBilling).allowed).toBe(false);
    expect(evaluatePermission(scope('CLIENT_VIEWER'), PERMISSIONS.requestRevisions).allowed).toBe(false);
  });

  it('allows client viewer downloadFiles and viewClientDashboard', () => {
    expect(evaluatePermission(scope('CLIENT_VIEWER'), PERMISSIONS.downloadFiles).allowed).toBe(true);
    expect(evaluatePermission(scope('CLIENT_VIEWER'), PERMISSIONS.viewClientDashboard).allowed).toBe(true);
  });

  it('grants fulfillment reviewer reviewOutputs and requestRevisions', () => {
    expect(evaluatePermission(scope('FULFILLMENT_REVIEWER'), PERMISSIONS.reviewOutputs).allowed).toBe(true);
    expect(evaluatePermission(scope('FULFILLMENT_REVIEWER'), PERMISSIONS.requestRevisions).allowed).toBe(true);
  });

  it('denies fulfillment reviewer manageJobs', () => {
    expect(evaluatePermission(scope('FULFILLMENT_REVIEWER'), PERMISSIONS.manageJobs).allowed).toBe(false);
  });

  it('grants billing manager manageBilling, viewRevenue, adjustCredits', () => {
    expect(evaluatePermission(scope('BILLING_MANAGER'), PERMISSIONS.manageBilling).allowed).toBe(true);
    expect(evaluatePermission(scope('BILLING_MANAGER'), PERMISSIONS.viewRevenue).allowed).toBe(true);
    expect(evaluatePermission(scope('BILLING_MANAGER'), PERMISSIONS.adjustCredits).allowed).toBe(true);
  });

  it('denies billing manager uploadImages', () => {
    expect(evaluatePermission(scope('BILLING_MANAGER'), PERMISSIONS.uploadImages).allowed).toBe(false);
  });

  it('returns denied for unknown role', () => {
    expect(evaluatePermission({ organizationId: 'org_1', role: 'NONEXISTENT' as any }, PERMISSIONS.manageJobs).allowed).toBe(false);
  });

  it('returns denied for unknown permission', () => {
    expect(evaluatePermission(scope('SUPER_ADMIN'), '__nonexistent__' as any).allowed).toBe(false);
  });
});

// ─── RBAC: evaluateTenantAccess — comprehensive ─────────────────────

describe('evaluateTenantAccess — tenant isolation', () => {
  const orgScope = (role: string, orgId = 'org_1', clientId?: string, agencyScope?: boolean) => ({ organizationId: orgId, role: role as any, clientId, agencyScope });

  it('allows super admin cross-org access', () => {
    expect(evaluateTenantAccess(orgScope('SUPER_ADMIN', 'org_1'), { organizationId: 'org_2', clientId: 'client_1' }).allowed).toBe(true);
  });

  it('blocks cross-organization access for non-admin', () => {
    expect(evaluateTenantAccess(orgScope('CLIENT_OWNER', 'org_1'), { organizationId: 'org_2', clientId: 'client_1' }).allowed).toBe(false);
  });

  it('blocks client-scoped role without clientId', () => {
    expect(evaluateTenantAccess(orgScope('CLIENT_OWNER', 'org_1'), { organizationId: 'org_1', clientId: 'client_1' }).allowed).toBe(false);
  });

  it('allows client-scoped role with matching clientId', () => {
    expect(evaluateTenantAccess(orgScope('CLIENT_OWNER', 'org_1', 'client_1'), { organizationId: 'org_1', clientId: 'client_1' }).allowed).toBe(true);
  });

  it('blocks client-scoped role with mismatched clientId', () => {
    expect(evaluateTenantAccess(orgScope('CLIENT_OWNER', 'org_1', 'client_1'), { organizationId: 'org_1', clientId: 'client_2' }).allowed).toBe(false);
  });

  it('allows CLIENT_VIEWER with matching client scope', () => {
    expect(evaluateTenantAccess(orgScope('CLIENT_VIEWER', 'org_1', 'client_1'), { organizationId: 'org_1', clientId: 'client_1' }).allowed).toBe(true);
  });

  it('blocks CLIENT_VIEWER without client scope', () => {
    expect(evaluateTenantAccess(orgScope('CLIENT_VIEWER', 'org_1'), { organizationId: 'org_1', clientId: 'client_1' }).allowed).toBe(false);
  });

  it('blocks agency scope when agencyScope=false', () => {
    expect(evaluateTenantAccess(orgScope('AGENCY_ADMIN', 'org_1', undefined, false), { organizationId: 'org_1' }).allowed).toBe(false);
  });

  it('allows agency scope when agencyScope=true or undefined', () => {
    expect(evaluateTenantAccess(orgScope('AGENCY_ADMIN', 'org_1', undefined, true), { organizationId: 'org_1' }).allowed).toBe(true);
    expect(evaluateTenantAccess(orgScope('AGENCY_ADMIN', 'org_1'), { organizationId: 'org_1' }).allowed).toBe(true);
  });

  it('allows OPERATOR same-org access', () => {
    expect(evaluateTenantAccess(orgScope('OPERATOR', 'org_1'), { organizationId: 'org_1' }).allowed).toBe(true);
  });

  it('returns correct reason messages', () => {
    expect(evaluateTenantAccess(orgScope('CLIENT_OWNER', 'org_1', 'client_1'), { organizationId: 'org_2', clientId: 'client_1' }).reason).toBe('organization_mismatch');
    expect(evaluateTenantAccess(orgScope('CLIENT_OWNER', 'org_1'), { organizationId: 'org_1', clientId: 'client_1' }).reason).toBe('client_role_missing_client_scope');
    expect(evaluateTenantAccess(orgScope('CLIENT_OWNER', 'org_1', 'client_1'), { organizationId: 'org_1', clientId: 'client_2' }).reason).toBe('client_scope_mismatch');
    expect(evaluateTenantAccess(orgScope('SUPER_ADMIN', 'org_1'), { organizationId: 'org_2' }).reason).toBe('super_admin_global');
  });
});
