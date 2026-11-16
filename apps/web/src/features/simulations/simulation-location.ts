import { customersReturnTo } from '../customers/list-location';
import {
  historySearch,
  parseHistoryLocation,
} from '../customers/detail-location';

export function simulationReturn(id: string, state: unknown) {
  let search = '';
  if (
    state &&
    typeof state === 'object' &&
    'customerSearch' in state &&
    typeof state.customerSearch === 'string'
  ) {
    try {
      search = historySearch(parseHistoryLocation(state.customerSearch).offset);
    } catch {
      /* Safe default for direct/tampered state. */
    }
  }
  return {
    to: '/customers/' + id + search,
    state: { returnTo: customersReturnTo(state) },
  };
}
