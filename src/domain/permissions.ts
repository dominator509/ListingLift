export const PERMISSIONS = {
  manageClients: 'manage:clients',
  manageJobs: 'manage:jobs',
  uploadImages: 'upload:images',
  reviewOutputs: 'review:outputs',
  approveOutputs: 'approve:outputs',
  requestRevisions: 'request:revisions',
  downloadFiles: 'download:files',
  managePackages: 'manage:packages',
  managePresets: 'manage:presets',
  manageSalesChannels: 'manage:sales-channels',
  manageIntegrations: 'manage:integrations',
  manageApiAccess: 'manage:api-access',
  manageSecurity: 'manage:security',
  manageQa: 'manage:qa',
  manageBilling: 'manage:billing',
  viewRevenue: 'view:revenue',
  manageAgencyBranding: 'manage:agency-branding',
  manageTeam: 'manage:team',
  viewClientDashboard: 'view:client-dashboard',
  exportDeliveryFiles: 'export:delivery-files',
  createManualOrders: 'create:manual-orders',
  adjustCredits: 'adjust:credits',
  sendDelivery: 'send:delivery',
  generateUpsells: 'generate:upsells',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type RoleKey =
  | 'SUPER_ADMIN'
  | 'OPERATOR'
  | 'AGENCY_ADMIN'
  | 'CLIENT_OWNER'
  | 'CLIENT_VIEWER'
  | 'FULFILLMENT_REVIEWER'
  | 'DESIGNER_EDITOR'
  | 'BILLING_MANAGER';

export const ROLE_PERMISSIONS: Record<RoleKey, PermissionKey[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  OPERATOR: [
    PERMISSIONS.manageClients,
    PERMISSIONS.manageJobs,
    PERMISSIONS.uploadImages,
    PERMISSIONS.reviewOutputs,
    PERMISSIONS.approveOutputs,
    PERMISSIONS.requestRevisions,
    PERMISSIONS.downloadFiles,
    PERMISSIONS.managePackages,
    PERMISSIONS.managePresets,
    PERMISSIONS.manageSalesChannels,
    PERMISSIONS.manageApiAccess,
    PERMISSIONS.manageQa,
    PERMISSIONS.viewRevenue,
    PERMISSIONS.exportDeliveryFiles,
    PERMISSIONS.createManualOrders,
    PERMISSIONS.sendDelivery,
    PERMISSIONS.generateUpsells,
  ],
  AGENCY_ADMIN: [
    PERMISSIONS.manageClients,
    PERMISSIONS.manageJobs,
    PERMISSIONS.uploadImages,
    PERMISSIONS.reviewOutputs,
    PERMISSIONS.requestRevisions,
    PERMISSIONS.downloadFiles,
    PERMISSIONS.manageBilling,
    PERMISSIONS.manageAgencyBranding,
    PERMISSIONS.manageTeam,
    PERMISSIONS.manageApiAccess,
    PERMISSIONS.viewClientDashboard,
    PERMISSIONS.exportDeliveryFiles,
    PERMISSIONS.createManualOrders,
  ],
  CLIENT_OWNER: [
    PERMISSIONS.uploadImages,
    PERMISSIONS.requestRevisions,
    PERMISSIONS.downloadFiles,
    PERMISSIONS.viewClientDashboard,
    PERMISSIONS.manageBilling,
  ],
  CLIENT_VIEWER: [PERMISSIONS.downloadFiles, PERMISSIONS.viewClientDashboard],
  FULFILLMENT_REVIEWER: [PERMISSIONS.reviewOutputs, PERMISSIONS.requestRevisions, PERMISSIONS.downloadFiles],
  DESIGNER_EDITOR: [PERMISSIONS.uploadImages, PERMISSIONS.reviewOutputs, PERMISSIONS.requestRevisions],
  BILLING_MANAGER: [PERMISSIONS.manageBilling, PERMISSIONS.viewRevenue, PERMISSIONS.adjustCredits],
};
