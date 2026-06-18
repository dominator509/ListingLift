import { ADVANCED_IMAGE_SECURITY_RULES, getAdvancedImageOperation, isAdvancedImageSafeClaim, type AdvancedImageOperationKey } from '@/domain/advanced-image-processing';

export function evaluateAdvancedImageOperationPolicy(input: {
  operationKeys: AdvancedImageOperationKey[];
  proposedCopy?: string;
  includesAutoPublish?: boolean;
  includesProductAlteration?: boolean;
  exposesClientFiles?: boolean;
  exposesUnapprovedOutputs?: boolean;
}) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const operations = input.operationKeys.map((operationKey) => getAdvancedImageOperation(operationKey)).filter(Boolean);

  if (input.includesAutoPublish) errors.push('Advanced image processing must not auto-publish to marketplaces or ecommerce stores.');
  if (input.exposesClientFiles) errors.push('Advanced image payloads must not expose raw client files outside server-side storage.');
  if (input.exposesUnapprovedOutputs) errors.push('Advanced outputs must not be exposed before admin approval and delivery gates.');
  if (input.includesProductAlteration) warnings.push('Product identity alteration requires manual review and should default to manual fallback.');
  if (input.proposedCopy && !isAdvancedImageSafeClaim(input.proposedCopy)) {
    errors.push('Proposed advanced-image copy contains prohibited marketplace/sales guarantee language.');
  }
  if (operations.some((operation) => operation?.riskLevel === 'HIGH')) {
    warnings.push('High-risk creative operations require explicit admin review and manual fallback availability.');
  }

  return {
    allowed: errors.length === 0,
    requiresManualReview: warnings.length > 0 || operations.some((operation) => operation?.requiresAdminApproval),
    errors,
    warnings,
    rules: ADVANCED_IMAGE_SECURITY_RULES,
  };
}
