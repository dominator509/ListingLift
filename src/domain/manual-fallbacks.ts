export const MANUAL_FALLBACK_ACTIONS = [
  'manual_upload',
  'manual_zip_upload',
  'manual_reprocessing',
  'manual_photoshop_canva_cleanup_marker',
  'manual_edited_file_upload',
  'manual_zip_creation',
  'manual_delivery_link',
  'manual_credit_adjustment',
  'manual_report_editing',
  'manual_order_entry',
  'manual_external_platform_delivery',
  'manual_revenue_attribution',
  'manual_platform_status_update',
  'manual_invoice_payment_confirmation',
  'manual_job_status_correction',
  'manual_final_delivery_approval',
] as const;

export type ManualFallbackAction = (typeof MANUAL_FALLBACK_ACTIONS)[number];

export function requiresAudit(action: ManualFallbackAction) {
  return action.startsWith('manual_');
}
