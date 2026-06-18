import { packageCheckoutSelectionSchema, type PackageCheckoutSelection } from '@/schemas/package';
import { buildPackageQuote } from './pricing-service';
import { requirePackageByKey } from './package-service';

export function buildCheckoutEntryDraft(input: PackageCheckoutSelection) {
  const data = packageCheckoutSelectionSchema.parse(input);
  const pkg = requirePackageByKey(data.packageKey);
  const quote = buildPackageQuote({ packageKey: data.packageKey, imageQuantity: data.imageQuantity, salesChannelKey: data.salesChannelKey, rushRequested: false, needsBrandBackgrounds: false, needsManualEditing: false });
  return {
    buyer: {
      name: data.buyerName,
      email: data.buyerEmail,
      businessName: data.businessName ?? null,
    },
    package: {
      key: pkg.key,
      name: pkg.name,
      checkoutMode: quote.checkoutMode,
      imageAllowance: pkg.imageAllowance,
      revisionAllowance: pkg.revisionAllowance,
    },
    intake: {
      targetPlatform: data.targetPlatform ?? null,
      imageQuantity: data.imageQuantity,
      salesChannelKey: data.salesChannelKey,
      deadline: data.deadline ?? null,
      notes: data.notes ?? null,
    },
    quote,
    normalizedJobDefaults: {
      paymentStatus: quote.manualQuoteRequired ? 'PENDING' : 'UNPAID',
      uploadStatus: 'NOT_STARTED',
      fulfillmentStatus: 'NOT_STARTED',
      status: 'DRAFT',
    },
    nextAction: quote.manualQuoteRequired ? 'operator_manual_quote' : 'checkout_provider_selection',
    safeClaim: pkg.safeClaim,
  };
}
