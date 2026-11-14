export const PLAN_CODES = ['DEMO_BASIC', 'DEMO_PRO'] as const;
export type PlanCode = (typeof PLAN_CODES)[number];
export const CONSUMPTION_LIMITS = {
  users: 1000,
  storageGb: 10000,
  apiCalls: 10000000,
} as const;
