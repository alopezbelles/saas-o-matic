const euro = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});
const date = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const count = new Intl.NumberFormat('es-ES');

/** Preserve every stored cent even at the safe-integer boundary. */
export function formatEuro(cents: number) {
  const amount = BigInt(cents);
  return euro
    .formatToParts(amount / 100n)
    .map((part) =>
      part.type === 'fraction'
        ? String(amount % 100n).padStart(2, '0')
        : part.value,
    )
    .join('');
}
export const formatDate = (value: string) => date.format(new Date(value));
export const formatCount = (value: number) => count.format(value);
