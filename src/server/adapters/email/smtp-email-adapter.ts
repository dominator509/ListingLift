import { redactEmailAddress } from '@/domain/delivery-notifications';
import type { EmailAdapter, EmailSendInput } from './types';

function smtpEnabled() {
  return process.env.EMAIL_ENABLED === 'true' && Boolean(process.env.SMTP_HOST) && Boolean(process.env.EMAIL_FROM);
}

export const smtpEmailAdapter: EmailAdapter = {
  key: 'smtp',
  displayName: 'SMTP Email Adapter',
  enabledByDefault: false,
  secretFields: ['SMTP_PASSWORD'],
  async send(input: EmailSendInput) {
    if (!smtpEnabled()) {
      return {
        ok: false,
        providerKey: 'smtp',
        redactedTo: redactEmailAddress(input.to),
        skipped: true,
        errorCode: 'smtp_disabled',
        errorMessage: 'SMTP is disabled or incomplete. Use mock email until EMAIL_ENABLED and SMTP settings are verified.',
      };
    }
    return {
      ok: false,
      providerKey: 'smtp',
      redactedTo: redactEmailAddress(input.to),
      skipped: true,
      errorCode: 'smtp_not_wired',
      errorMessage: 'Codex must wire nodemailer in the target runtime and add integration tests before enabling SMTP sends.',
    };
  },
  async healthCheck() {
    if (!smtpEnabled()) return { ok: false, message: 'SMTP disabled or missing configuration.' };
    return { ok: true, message: 'SMTP configuration appears present. Runtime send must still be verified by Codex.' };
  },
};
