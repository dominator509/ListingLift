import { buildUpworkDedupeKey, normalizeUpworkContractId, redactUpworkClient } from '@/domain/upwork';
import { upworkManualContractInputSchema, type UpworkManualContractInput } from '@/schemas/upwork';
import { normalizeUpworkOrder } from '@/server/services/sales-channel-normalizer';
import { resolveUpworkOfferMapping } from './upwork-package-mapping-service';

export function createUpworkManualContractPlan(input: UpworkManualContractInput) {
  const parsed = upworkManualContractInputSchema.parse(input);
  const mapping = resolveUpworkOfferMapping(parsed);
  const externalOrderId = normalizeUpworkContractId(parsed.contractId);
  const billedAmountCents = parsed.billedAmountCents ?? parsed.billedAmount ?? 0;
  const hourlyRateCents = parsed.hourlyRateCents ?? parsed.hourlyRate;
  const normalized = normalizeUpworkOrder({
    contract_id: externalOrderId,
    client_name: parsed.clientName,
    client_username: parsed.clientUsername,
    contract_title: parsed.contractTitle,
    packagePurchased: parsed.packagePurchased ?? mapping.mapping.title,
    package_key: mapping.packageKey,
    amount: billedAmountCents / 100,
    currency: parsed.currency,
    deadline: parsed.dueDate,
    revisionAllowance: parsed.revisionAllowance ?? mapping.revisionAllowance,
    contract_url: parsed.sourceUrl || undefined,
    paymentStatus: 'MANUAL_CONFIRMED',
  });

  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    externalOrderDraft: {
      provider: 'upwork',
      externalOrderId,
      dedupeKey: buildUpworkDedupeKey(externalOrderId),
      clientNameRedacted: redactUpworkClient(parsed.clientName),
      clientCompany: parsed.clientCompany,
      contractTitle: parsed.contractTitle,
      contractType: parsed.contractType,
      milestoneTitle: parsed.milestoneTitle,
      milestoneStatus: parsed.milestoneStatus,
      packageKey: mapping.packageKey,
      billedAmountCents,
      hourlyRateCents,
      estimatedHours: parsed.estimatedHours,
      currency: parsed.currency,
      dueDate: parsed.dueDate,
      revisionAllowance: parsed.revisionAllowance ?? mapping.revisionAllowance,
      sourceUrl: parsed.sourceUrl || undefined,
      normalized,
    },
    clientDraft: {
      existingClientId: parsed.existingClientId,
      displayName: parsed.clientCompany ?? parsed.clientName,
      marketplaceUsername: parsed.clientUsername,
      source: 'Upwork',
    },
    jobDraft: {
      title: `Upwork ${parsed.contractTitle} — ${externalOrderId}`,
      packageKey: mapping.packageKey,
      imageQuantity: mapping.imageAllowance,
      status: parsed.uploadStatus === 'RECEIVED' ? 'UPLOAD_RECEIVED' : 'WAITING_FOR_UPLOAD',
      targetPlatform: 'Marketplace sellers',
      deadline: parsed.dueDate,
      sourceChannel: 'Upwork',
      adminNotes: parsed.contractNotes,
    },
    uploadLinkPlan: mapping.mapping.createsUploadLink
      ? { shouldCreateUploadToken: true, reason: 'Upwork contract requires source files before processing.', fileLimit: mapping.imageAllowance }
      : { shouldCreateUploadToken: false, reason: 'Selected Upwork mapping does not require an upload link.' },
    retainerReminderPlan: {
      shouldPrompt: mapping.mapping.retainerReminderEnabled,
      reason: mapping.mapping.retainerReminderEnabled
        ? 'Upwork is a high-value channel for recurring catalog cleanup and retainer upsells.'
        : 'Small fixed-price cleanup does not require a default retainer reminder.',
    },
    safety: {
      manualFirst: true,
      noScraping: true,
      noPasswordStorage: true,
      noUnauthorizedMessaging: true,
      deliveryShouldOccurInsideUpworkWhenRequired: true,
    },
  };
}
