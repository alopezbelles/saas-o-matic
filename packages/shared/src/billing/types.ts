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

export type TaxPolicy = {
  readonly version: string;
  readonly ratesByCountry: Readonly<Record<string, number>>;
};
