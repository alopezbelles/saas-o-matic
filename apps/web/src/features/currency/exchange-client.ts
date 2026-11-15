import {
  ExchangeError,
  parseExchangeRates,
  type ExchangeRates,
} from './exchange-contract.js';

type RequestedCurrency =
  ExchangeRates['baseCurrency'] | keyof ExchangeRates['rates'];

interface ExchangeClientOptions {
  readonly fetch?: typeof globalThis.fetch;
  readonly now?: () => number;
}

export interface ExchangeClient {
  /** null means EUR identity: no external rate or provider metadata required. */
  getRates(currency: RequestedCurrency): Promise<ExchangeRates | null>;
}

const ENDPOINT = 'https://open.er-api.com/v6/latest/EUR';
const TIMEOUT_MS = 5000;

/** One instance per tab; inject dependencies or create new instances for tests. */
export function createExchangeClient(
  options: ExchangeClientOptions = {},
): ExchangeClient {
  const fetcher = options.fetch ?? ((...args) => globalThis.fetch(...args));
  const now = options.now ?? Date.now;
  let cached: ExchangeRates | undefined;
  let inFlight: Promise<ExchangeRates> | undefined;

  async function load(): Promise<ExchangeRates> {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new ExchangeError('EXCHANGE_TIMEOUT'));
        controller.abort();
      }, TIMEOUT_MS);
    });
    const request = (async (): Promise<unknown> => {
      let response: Response;
      try {
        response = await fetcher(ENDPOINT, {
          method: 'GET',
          signal: controller.signal,
          credentials: 'omit',
          cache: 'no-store',
          referrerPolicy: 'no-referrer',
        });
      } catch {
        throw new ExchangeError('EXCHANGE_NETWORK_ERROR');
      }
      if (!response.ok) throw new ExchangeError('EXCHANGE_HTTP_ERROR');
      try {
        return await response.json();
      } catch {
        throw new ExchangeError('EXCHANGE_PAYLOAD_INVALID');
      }
    })();
    try {
      const payload = await Promise.race([request, timeout]);
      return parseExchangeRates(payload, now());
    } finally {
      clearTimeout(timer);
    }
  }

  return Object.freeze({
    async getRates(currency: RequestedCurrency): Promise<ExchangeRates | null> {
      if (currency === 'EUR') return null;
      if (currency !== 'USD' && currency !== 'GBP') {
        throw new TypeError('Unsupported currency');
      }
      const currentTime = now();
      if (!Number.isSafeInteger(currentTime) || currentTime < 0) {
        throw new ExchangeError('EXCHANGE_PAYLOAD_INVALID');
      }
      if (
        cached &&
        Date.parse(cached.expiresAt) > currentTime &&
        Date.parse(cached.updatedAt) <= currentTime
      ) {
        return cached;
      }
      cached = undefined;
      if (!inFlight) {
        inFlight = load()
          .then((rates) => {
            cached = rates;
            return rates;
          })
          .finally(() => {
            inFlight = undefined;
          });
      }
      return inFlight;
    },
  });
}

/** Importing this instance never performs a request. */
export const exchangeClient = createExchangeClient();
