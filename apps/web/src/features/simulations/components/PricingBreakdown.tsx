import type { BillingQuote } from '@saas-o-matic/shared';
import { formatCount, formatEuro } from '../../customers/format';
import { countryLabel } from '../../customers/customer-labels';
import styles from './SimulationSummary.module.css';

const percent = new Intl.NumberFormat('es-ES', {
  style: 'percent',
  maximumFractionDigits: 2,
});
export function PricingBreakdown({
  quote,
  countryCode,
}: {
  quote: BillingQuote;
  countryCode: string;
}) {
  return (
    <dl className={styles.breakdown}>
      {quote.breakdown.map((tier) => (
        <div className={styles.row} key={tier.tierFrom}>
          <dt>
            {tier.tierFrom === 1 ? 'Primeros' : 'Siguientes'}{' '}
            {formatCount(tier.quantity)}{' '}
            {tier.quantity === 1 ? 'usuario' : 'usuarios'} ×{' '}
            {formatEuro(tier.unitPriceCents)}
          </dt>
          <dd>{formatEuro(tier.subtotalCents)}</dd>
        </div>
      ))}
      {quote.breakdown.length === 0 && (
        <div className={styles.row}>
          <dt>Usuarios activos</dt>
          <dd>0</dd>
        </div>
      )}
      <div className={styles.row + ' ' + styles.subtotal}>
        <dt>Subtotal</dt>
        <dd>{formatEuro(quote.baseCents)}</dd>
      </div>
      <div className={styles.row}>
        <dt>
          Impuesto {countryLabel(countryCode)} (
          {percent.format(quote.rateBps / 10000)})
        </dt>
        <dd>{formatEuro(quote.taxCents)}</dd>
      </div>
    </dl>
  );
}
