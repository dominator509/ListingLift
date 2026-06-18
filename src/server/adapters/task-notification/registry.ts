import type { TaskNotificationActionKey, TaskNotificationProviderKey } from '@/domain/task-notification-integrations';
import type { TaskNotificationAdapter } from './types';
import { mockTaskNotificationAdapter } from './mock-task-notification-adapter';
import { slackTaskNotificationAdapter } from './slack-task-notification-adapter';
import { smtpTaskNotificationAdapter } from './smtp-task-notification-adapter';
import { googleSheetsExportAdapter } from './google-sheets-export-adapter';
import { airtableExportAdapter } from './airtable-export-adapter';
import { trelloTaskAdapter } from './trello-task-adapter';
import { clickupTaskAdapter } from './clickup-task-adapter';
import { asanaTaskAdapter } from './asana-task-adapter';
import { notionTaskExportAdapter } from './notion-task-export-adapter';

const adapters: TaskNotificationAdapter[] = [
  mockTaskNotificationAdapter,
  slackTaskNotificationAdapter,
  smtpTaskNotificationAdapter,
  googleSheetsExportAdapter,
  airtableExportAdapter,
  trelloTaskAdapter,
  clickupTaskAdapter,
  asanaTaskAdapter,
  notionTaskExportAdapter,
];

export function listTaskNotificationAdapters() {
  return adapters.map((adapter) => ({ key: adapter.key, label: adapter.label, actions: adapter.actions }));
}

export function getTaskNotificationAdapter(providerKey: TaskNotificationProviderKey) {
  const adapter = adapters.find((candidate) => candidate.key === providerKey);
  if (!adapter) throw new Error(`Unsupported task notification adapter: ${providerKey}`);
  return adapter;
}

export function assertTaskNotificationAction(providerKey: TaskNotificationProviderKey, actionKey: TaskNotificationActionKey) {
  const adapter = getTaskNotificationAdapter(providerKey);
  if (!adapter.actions.includes(actionKey)) {
    throw new Error(`${providerKey} does not support ${actionKey}`);
  }
  return adapter;
}
