import { AGENCY_WHITE_LABEL_SAFE_COPY, agencyWhiteLabelCopyContainsUnsafeGuarantee, buildAgencyBrandPreview } from '@/domain/agency-white-label';
import {
  agencyBrandedDeliveryTemplateSchema,
  agencyBrandedReportDraftSchema,
  agencyWhiteLabelSettingsDraftSchema,
  type AgencyBrandedDeliveryTemplateInput,
  type AgencyBrandedReportDraftInput,
  type AgencyWhiteLabelSettingsDraftInput,
} from '@/schemas/agency-white-label';

export const demoAgencyBrandSettings: AgencyWhiteLabelSettingsDraftInput = {
  portalName: 'Atlas Studio Fulfillment',
  primaryColor: '#0f172a',
  secondaryColor: '#2563eb',
  supportEmail: 'support@atlas-studio.example',
  customDomain: 'portal.atlas-studio.example',
  hideListingLiftBranding: true,
  deliveryFooter: 'Prepared by Atlas Studio for ecommerce product image review.',
  reviewStatus: 'NEEDS_REVIEW',
};

export function validateAgencyWhiteLabelSettingsDraft(input: AgencyWhiteLabelSettingsDraftInput) {
  return agencyWhiteLabelSettingsDraftSchema.parse(input);
}

export function buildAgencyWhiteLabelSettingsPreview(input: AgencyWhiteLabelSettingsDraftInput = demoAgencyBrandSettings) {
  const parsed = validateAgencyWhiteLabelSettingsDraft(input);
  const preview = buildAgencyBrandPreview(parsed);
  return {
    preview,
    unsafeCopyDetected: agencyWhiteLabelCopyContainsUnsafeGuarantee(parsed.deliveryFooter ?? ''),
    notices: {
      branding: AGENCY_WHITE_LABEL_SAFE_COPY.brandingNotice,
      guarantee: AGENCY_WHITE_LABEL_SAFE_COPY.guaranteeNotice,
    },
    dryRun: true,
  };
}

export function buildAgencyBrandedDeliveryDraft(input: AgencyBrandedDeliveryTemplateInput) {
  const parsed = agencyBrandedDeliveryTemplateSchema.parse(input);
  const footer = parsed.footerOverride ?? demoAgencyBrandSettings.deliveryFooter ?? '';
  return {
    title: `${parsed.clientName} image delivery is ready`,
    body: `Your ${parsed.packageName} files are approved for review and download. The secure link should expire in ${parsed.expiresInDays} days.`,
    approvedFileCount: parsed.approvedFileCount,
    includeReportLink: parsed.includeReportLink,
    footer,
    unsafeCopyDetected: agencyWhiteLabelCopyContainsUnsafeGuarantee(footer),
    manualReviewRequired: true,
    approvalGateRequired: true,
    tokenGateRequired: true,
    safeCopy: AGENCY_WHITE_LABEL_SAFE_COPY.deliveryNotice,
    dryRun: true,
  };
}

export function buildAgencyBrandedReportDraft(input: AgencyBrandedReportDraftInput) {
  const parsed = agencyBrandedReportDraftSchema.parse(input);
  return {
    reportTitle: `${parsed.clientName} ${parsed.reportType.replaceAll('_', ' ').toLowerCase()} report`,
    reportType: parsed.reportType,
    approvedImageCount: parsed.approvedImageCount,
    sections: ['Image pack summary', 'Quality summary', 'Platform delivery summary', 'Before/after highlights', 'Manual next-step recommendations'],
    includeUpsellDrafts: parsed.includeUpsellDrafts,
    unsafeCopyDetected: false,
    manualReviewRequired: true,
    safeCopy: AGENCY_WHITE_LABEL_SAFE_COPY.reportsNotice,
    guaranteeNotice: AGENCY_WHITE_LABEL_SAFE_COPY.guaranteeNotice,
    dryRun: true,
  };
}
