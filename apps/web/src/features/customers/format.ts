import { CURRENCY_EXPONENTS, type CurrencyCode } from '@saas-o-matic/shared';
const money = Object.fromEntries(
  Object.keys(CURRENCY_EXPONENTS).map((currency) => [
    currency,
    new Intl.NumberFormat('es-ES', { style: 'currency', currency }),
  ]),
) as Record<CurrencyCode, Intl.NumberFormat>;
const date = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const count = new Intl.NumberFormat('es-ES');

/** Preserve every stored cent even at the safe-integer boundary. */
export function formatMoney(cents: number, currency: CurrencyCode) {
  const amount = BigInt(cents);
  return money[currency]
    .formatToParts(amount / 100n)
    .map((part) =>
      part.type === 'fraction'
        ? String(amount % 100n).padStart(2, '0')
        : part.value,
    )
    .join('');
}
export const formatEuro = (cents: number) => formatMoney(cents, 'EUR');
export const formatDate = (value: string) => date.format(new Date(value));
export const formatCount = (value: number) => count.format(value);
