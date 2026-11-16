import { useEffect, useState } from 'react';
import type { CustomerPage, CustomerQuery } from '@saas-o-matic/shared';
import { listCustomers } from './api/customers';
import { ApiRequestError } from './api/http';

type CustomersState =
  | { key: string; status: 'loading' }
  | { key: string; status: 'success'; page: CustomerPage }
  | { key: string; status: 'error'; message: string };

export function useCustomers(query: CustomerQuery | null) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<CustomersState>({
    key: '',
    status: 'loading',
  });
  const key = JSON.stringify([query, attempt]);

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    let active = true;
    void listCustomers(query, controller.signal).then(
      (page) => {
        if (active) setState({ key, status: 'success', page });
      },
      (error: unknown) => {
        if (!active) return;
        setState({
          key,
          status: 'error',
          message:
            error instanceof ApiRequestError
              ? error.message
              : 'No se han podido cargar los clientes.',
        });
      },
    );
    return () => {
      active = false;
      controller.abort();
    };
  }, [query, key]);

  const current: CustomersState =
    state.key === key ? state : { key, status: 'loading' };
  return {
    state: current,
    retry: () => setAttempt((previous) => previous + 1),
  };
}
