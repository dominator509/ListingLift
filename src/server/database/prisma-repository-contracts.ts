import type { PrismaClient } from '@prisma/client';

export type RepositoryContext = {
  prisma: PrismaClient;
  organizationId: string;
  actorUserId?: string;
};

export function createRepositoryContext(prisma: PrismaClient, organizationId: string, actorUserId?: string): RepositoryContext {
  if (!organizationId) throw new Error('organizationId is required');
  return { prisma, organizationId, actorUserId };
}

export const PHASE_2_DATABASE_CONTRACT = {
  requiredModels: [
    'User',
    'Organization',
    'Membership',
    'Role',
    'Permission',
    'Client',
    'SalesChannel',
    'ExternalOrder',
    'Job',
    'Image',
    'ProcessedFile',
    'Package',
    'PlatformPreset',
    'CreditLedger',
    'Subscription',
    'InvoicePayment',
    'RevisionRequest',
    'Report',
    'WebhookEvent',
    'UpsellOffer',
    'DeliveryLink',
    'IntegrationConnection',
    'EncryptedSecret',
    'AutomationEvent',
    'AuditLog',
    'BrandSetting',
  ],
  tenantCriticalModels: [
    'Client',
    'SalesChannel',
    'ExternalOrder',
    'Job',
    'Image',
    'ProcessedFile',
    'CreditLedger',
    'Subscription',
    'InvoicePayment',
    'Report',
    'WebhookEvent',
    'UpsellOffer',
    'IntegrationConnection',
    'EncryptedSecret',
    'AutomationEvent',
    'AuditLog',
  ],
} as const;
