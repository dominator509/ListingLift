export type NotificationMessage = {
  to: string;
  subject: string;
  body: string;
};

export async function sendMockNotification(message: NotificationMessage) {
  return {
    ok: true,
    provider: 'mock-email',
    messageId: `mock_${Date.now()}`,
    redactedTo: message.to.replace(/(^.).*(@.*$)/, '$1***$2'),
  };
}
