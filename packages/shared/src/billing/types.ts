export type TierBreakdown = {
  tierFrom: number;
  tierTo: number | null;
  quantity: number;
  unitPriceCents: number;
  subtotalCents: number;
};

export type TieredBase = {
  baseCents: number;
  pricingVersion: string;
  breakdown: TierBreakdown[];
};

export type PricingConfiguration = {
  pricingVersion: string;
  tiers: Pick<TierBreakdown, 'tierFrom' | 'tierTo' | 'unitPriceCents'>[];
};

export type TaxPolicy = {
  readonly version: string;
  readonly ratesByCountry: Readonly<Record<string, number>>;
};

export type BillingInput = {
  users: number;
  storageGb: number;
  apiCalls: number;
  countryCode: string;
};

export type BillingQuote = TieredBase & {
  taxCents: number;
  totalCents: number;
  currency: 'EUR';
  rateBps: number;
  taxPolicyVersion: string;
};
