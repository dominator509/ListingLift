import type { z } from 'zod';

export type EmailSendInput = {
  to: string;
  subject: string;
  text: string;
  html?: string | null;
  replyTo?: string | null;
  metadata?: Record<string, unknown>;
};

export type EmailSendResult = {
  ok: boolean;
  providerKey: string;
  messageId?: string;
  skipped?: boolean;
  redactedTo: string;
  errorCode?: string;
  errorMessage?: string;
};

export type EmailAdapter = {
  key: string;
  displayName: string;
  enabledByDefault: boolean;
  secretFields: string[];
  configSchema?: z.ZodTypeAny;
  send(input: EmailSendInput): Promise<EmailSendResult>;
  healthCheck(): Promise<{ ok: boolean; message: string }>;
};
