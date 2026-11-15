export type BillingErrorCode =
  | 'BILLING_INPUT_INVALID'
  | 'BILLING_POLICY_INVALID'
  | 'TAX_COUNTRY_UNSUPPORTED'
  | 'BILLING_MONEY_INVALID'
  | 'BILLING_MONEY_OVERFLOW';

export class BillingError extends Error {
  readonly code: BillingErrorCode;
  readonly field?: string;

  constructor(code: BillingErrorCode, field?: string) {
    super(code);
    this.name = 'BillingError';
    this.code = code;
    if (field !== undefined) this.field = field;
  }
}
