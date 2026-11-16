import { InputError, parseSimulationQuery } from '@saas-o-matic/shared';

export const HISTORY_PAGE_SIZE = 20;

export function parseHistoryLocation(search: string) {
  const params = new URLSearchParams(search);
  for (const key of params.keys())
    if (key !== 'historyOffset') throw new InputError('INVALID_QUERY');
  return parseSimulationQuery(
    [...params].map(([, value]) => ['offset', value]),
  );
}

export function historySearch(offset = 0) {
  const query = parseSimulationQuery([['offset', String(offset)]]);
  return query.offset ? '?historyOffset=' + query.offset : '';
}

export function nextHistoryPageAllowed(offset: number, total: number) {
  if (offset + HISTORY_PAGE_SIZE >= total) return false;
  try {
    historySearch(offset + HISTORY_PAGE_SIZE);
    return true;
  } catch {
    return false;
  }
}
