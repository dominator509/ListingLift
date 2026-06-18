import { redactEmailAddress } from '@/domain/delivery-notifications';
import type { EmailAdapter, EmailSendInput } from './types';

export const mockEmailAdapter: EmailAdapter = {
  key: 'mock-email',
  displayName: 'Mock Email Adapter',
  enabledByDefault: true,
  secretFields: [],
  async send(input: EmailSendInput) {
    return {
      ok: true,
      providerKey: 'mock-email',
      messageId: `mock_email_${Date.now()}`,
      redactedTo: redactEmailAddress(input.to),
      skipped: false,
    };
  },
  async healthCheck() {
    return { ok: true, message: 'Mock email adapter is available without SMTP credentials.' };
  },
};
