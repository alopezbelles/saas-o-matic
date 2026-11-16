import { useEffect, useState } from 'react';
import {
  getCustomerCountries,
  type CustomerCountry,
} from './api/billing-config';

type CountryState =
  | { status: 'loading'; countries: CustomerCountry[] }
  | { status: 'error'; countries: CustomerCountry[] }
  | { status: 'ready'; countries: CustomerCountry[] };

export function useCustomerCountries() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<CountryState>({
    status: 'loading',
    countries: [],
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    void getCustomerCountries(controller.signal).then(
      (countries) => {
        if (active) setState({ status: 'ready', countries });
      },
      () => {
        if (active) setState({ status: 'error', countries: [] });
      },
    );
    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt]);

  return {
    ...state,
    retry() {
      setState({ status: 'loading', countries: [] });
      setAttempt((previous) => previous + 1);
    },
  };
}
