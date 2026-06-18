import { guardedGet } from '@/server/routes/route-helpers';

export async function GET(request: Request) {
  return guardedGet(request, 'manage:billing', async () => ({ note: 'Billing service scaffold. Stripe and manual payment adapters exist.' }));
}
