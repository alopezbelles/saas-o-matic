import { useEffect, useState } from 'react';
import type { CurrencyCode } from '@saas-o-matic/shared';
import {
  exchangeClient,
  type ExchangeClient,
} from '../currency/exchange-client';
import type { ExchangeRates } from '../currency/exchange-contract';

type RatesState =
  | { key: string; status: 'loading' }
  | { key: string; status: 'success'; rates: ExchangeRates }
  | { key: string; status: 'error'; message: string };

/** Amount changes reuse rates; unmount never aborts the client's shared request. */
export function useExchangeRates(
  currency: CurrencyCode,
  enabled: boolean,
  client: ExchangeClient = exchangeClient,
) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<RatesState>({
    key: '',
    status: 'loading',
  });
  const key = JSON.stringify([currency, enabled, attempt]);
  const [selection, setSelection] = useState(key);
  // Clear the previously displayed selection before commit, including EUR→foreign
  // after its old rates expired while the foreign view was inactive.
  if (selection !== key) {
    setSelection(key);
    setState({ key, status: 'loading' });
  }
  useEffect(() => {
    if (!enabled || currency === 'EUR') return;
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let checkExpiry = () => {};
    const checkVisibility = () => {
      if (document.visibilityState === 'visible') checkExpiry();
    };
    void client.getRates(currency).then(
      (rates) => {
        if (!active) return;
        if (!rates) {
          setState({
            key,
            status: 'error',
            message:
              'No se han podido obtener tasas válidas. Se muestra el total en EUR.',
          });
          return;
        }
        checkExpiry = () => {
          if (!active) return;
          clearTimeout(timer);
          const remaining = Date.parse(rates.expiresAt) - Date.now();
          if (!Number.isFinite(remaining) || remaining <= 0) {
            setState({
              key,
              status: 'error',
              message: 'Las tasas han caducado. Se muestra el total en EUR.',
            });
          } else
            timer = setTimeout(checkExpiry, Math.min(remaining, 2147483647));
        };
        setState({ key, status: 'success', rates });
        checkExpiry();
      },
      () => {
        if (active)
          setState({
            key,
            status: 'error',
            message:
              'No se ha podido convertir el total. Se muestra en EUR; puedes reintentar la conversión.',
          });
      },
    );
    // Use a stable listener reference so cleanup also handles StrictMode correctly.
    const onFocus = () => checkExpiry();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', checkVisibility);
    return () => {
      active = false;
      clearTimeout(timer);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', checkVisibility);
    };
  }, [currency, enabled, client, key]);
  const current: RatesState =
    state.key === key ? state : { key, status: 'loading' };
  return {
    state: current,
    retry: () => setAttempt((previous) => previous + 1),
  };
}
