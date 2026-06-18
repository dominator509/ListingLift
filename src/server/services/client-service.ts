import { clientCreateSchema, clientUpdateSchema, type ClientCreateInput, type ClientUpdateInput } from '@/schemas/client';

export function validateClientCreate(input: ClientCreateInput) {
  return clientCreateSchema.parse(input);
}

export function validateClientUpdate(input: ClientUpdateInput) {
  return clientUpdateSchema.parse(input);
}

export function buildClientDisplayName(client: { name: string; businessName?: string | null }) {
  return client.businessName ? `${client.businessName} (${client.name})` : client.name;
}
