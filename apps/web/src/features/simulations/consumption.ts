import { assertConsumption } from '@saas-o-matic/shared';

export type ConsumptionField = 'users' | 'storageGb' | 'apiCalls';
export type ConsumptionDraft = Record<ConsumptionField, string>;

export function parseConsumptionField(
  value: string,
  field: ConsumptionField,
): number | null {
  if (!/^\d+$/.test(value)) return null;
  const number = Number(value);
  try {
    assertConsumption(number, field);
    return number;
  } catch {
    return null;
  }
}

export function parseConsumptionDraft(draft: ConsumptionDraft) {
  const users = parseConsumptionField(draft.users, 'users');
  const storageGb = parseConsumptionField(draft.storageGb, 'storageGb');
  const apiCalls = parseConsumptionField(draft.apiCalls, 'apiCalls');
  return users === null || storageGb === null || apiCalls === null
    ? null
    : { users, storageGb, apiCalls };
}
