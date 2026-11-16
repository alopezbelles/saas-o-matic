import { convertCurrency, type CurrencyCode } from '@saas-o-matic/shared';
import type { Preview } from '../useSimulationQuote';
import { useExchangeRates } from '../useExchangeRates';
import { formatEuro, formatMoney } from '../../customers/format';
import { PricingBreakdown } from './PricingBreakdown';
import styles from './SimulationSummary.module.css';
import panel from './ConsumptionInputs.module.css';
import shared from '../../customers/components/Customers.module.css';

const dateTime = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});
export function SimulationSummary({
  preview,
  countryCode,
  currency,
}: {
  preview: Preview;
  countryCode: string;
  currency: CurrencyCode;
}) {
  const { state, retry } = useExchangeRates(
    currency,
    preview.status !== 'unavailable',
  );
  const quote = preview.status === 'success' ? preview.quote : null;
  let total = quote ? formatEuro(quote.totalCents) : '';
  let conversionFailed = false;
  if (quote && currency !== 'EUR' && state.status === 'success') {
    try {
      total = formatMoney(
        convertCurrency({
          amountEurCents: quote.totalCents,
          targetCurrency: currency,
          rate: state.rates.rates[currency],
        }).amountMinor,
        currency,
      );
    } catch {
      conversionFailed = true;
    }
  }
  return (
    <section className={panel.panel} aria-labelledby="summary-heading">
      <h2 id="summary-heading">Resumen mensual</h2>
      <div className={panel.body}>
        {!quote ? (
          <p role="status">
            {preview.status === 'invalid'
              ? 'Revisa los consumos para ver el presupuesto.'
              : preview.status === 'error'
                ? 'No se puede calcular un presupuesto válido con esta configuración.'
                : 'El presupuesto estará disponible cuando se carguen el cliente y una configuración compatible.'}
          </p>
        ) : (
          <>
            <PricingBreakdown quote={quote} countryCode={countryCode} />
            <div className={styles.total}>
              <span>Total mensual</span>
              <output aria-label="Total mensual">{total}</output>
            </div>
            {currency !== 'EUR' && state.status === 'loading' && (
              <p role="status">
                Cargando conversión… Se muestra el total en EUR.
              </p>
            )}
            {currency !== 'EUR' &&
              (state.status === 'error' || conversionFailed) && (
                <div className={styles.notice} role="alert">
                  <p>
                    {state.status === 'error'
                      ? state.message
                      : 'No se ha podido convertir este importe. Se muestra el total en EUR.'}
                  </p>
                  <button
                    type="button"
                    className={shared.button}
                    onClick={retry}
                  >
                    Reintentar conversión
                  </button>
                </div>
              )}
            {currency !== 'EUR' &&
              state.status === 'success' &&
              !conversionFailed && (
                <div className={styles.source}>
                  <p>Equivalente en EUR: {formatEuro(quote.totalCents)}</p>
                  <p>
                    Conversión orientativa al tipo de{' '}
                    <time dateTime={state.rates.updatedAt}>
                      {dateTime.format(new Date(state.rates.updatedAt))} UTC
                    </time>
                    .
                  </p>
                  <a
                    href={state.rates.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {state.rates.source.attribution}
                  </a>
                </div>
              )}
            <p className={styles.source}>
              El cálculo base se realiza en EUR. Las otras divisas convierten
              únicamente el total mensual.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
