import { useCallback } from 'react';
import type { CustomerPage, CustomerQuery } from '@saas-o-matic/shared';
import { listCustomers } from './api/customers';
import { ApiRequestError } from './api/http';
import { useApiResource } from './useApiResource';

type CustomersState =
  | { key: string; status: 'loading' }
  | { key: string; status: 'success'; page: CustomerPage }
  | { key: string; status: 'error'; message: string };

export function useCustomers(query: CustomerQuery | null) {
  const load = useCallback(
    (signal: AbortSignal) => listCustomers(query!, signal),
    [query],
  );
  const { state, retry } = useApiResource(
    JSON.stringify(query),
    query ? load : null,
  );
  const current: CustomersState =
    state.status === 'success'
      ? { key: state.key, status: 'success', page: state.value }
      : state.status === 'error'
        ? {
            key: state.key,
            status: 'error',
            message:
              state.error instanceof ApiRequestError
                ? state.error.message
                : 'No se han podido cargar los clientes.',
          }
        : state;
  return {
    state: current,
    retry,
  };
}
