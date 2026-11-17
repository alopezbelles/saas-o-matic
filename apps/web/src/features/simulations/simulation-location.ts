import { customersReturnTo } from '../customers/list-location';
import { isRecord } from '../customers/api/http';
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

/** Navigation feedback never supplies rows or amounts to the persisted history. */
export function simulationComparison(state: unknown, customerId: string) {
  if (!isRecord(state) || !isRecord(state.simulationComparison)) return null;
  const comparison = state.simulationComparison;
  if (
    comparison.customerId !== customerId ||
    typeof comparison.previousTotalCents !== 'number' ||
    !Number.isSafeInteger(comparison.previousTotalCents) ||
    comparison.previousTotalCents < 0 ||
    typeof comparison.savedTotalCents !== 'number' ||
    !Number.isSafeInteger(comparison.savedTotalCents) ||
    comparison.savedTotalCents < 0
  )
    return null;
  return {
    previousTotalCents: comparison.previousTotalCents,
    savedTotalCents: comparison.savedTotalCents,
  };
}
