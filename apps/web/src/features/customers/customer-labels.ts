import type { CreateCustomer, PlanCode } from '@saas-o-matic/shared';

export const PLAN_LABELS: Record<PlanCode, string> = {
  DEMO_BASIC: 'Básico (demo)',
  DEMO_PRO: 'Profesional (demo)',
};

export const CUSTOMER_FIELD_LABELS: Record<keyof CreateCustomer, string> = {
  companyName: 'Nombre de empresa',
  taxId: 'Identificador fiscal (DNI/NIF/CIF)',
  contactEmail: 'Email de contacto',
  countryCode: 'País',
  planCode: 'Plan elegido',
};

const countryNames = new Intl.DisplayNames(['es'], { type: 'region' });
export function countryLabel(code: string) {
  return countryNames.of(code) ?? code;
}
