import {
  InputError,
  parseCustomerQuery,
  type CustomerQuery,
} from '@saas-o-matic/shared';

export const CUSTOMER_PAGE_SIZE = 20;

export function parseListLocation(search: string): CustomerQuery {
  const params = new URLSearchParams(search);
  for (const key of params.keys()) {
    if (key !== 'q' && key !== 'offset') throw new InputError('INVALID_QUERY');
  }
  return parseCustomerQuery(params.entries());
}

export function listSearch(q: string, offset = 0): string {
  const params = new URLSearchParams({ q, offset: String(offset) });
  const query = parseCustomerQuery(params.entries());
  const result = new URLSearchParams();
  if (query.q) result.set('q', query.q);
  if (query.offset) result.set('offset', String(query.offset));
  return result.size ? '?' + result.toString() : '';
}

export function customersReturnTo(state: unknown): string {
  if (
    !state ||
    typeof state !== 'object' ||
    !('returnTo' in state) ||
    typeof state.returnTo !== 'string'
  ) {
    return '/customers';
  }
  try {
    const url = new URL(state.returnTo, 'http://local.invalid');
    if (
      url.origin !== 'http://local.invalid' ||
      url.pathname !== '/customers' ||
      url.hash
    )
      return '/customers';
    const query = parseListLocation(url.search);
    return '/customers' + listSearch(query.q, query.offset);
  } catch {
    return '/customers';
  }
}

export function nextPageAllowed(query: CustomerQuery, total: number): boolean {
  if (query.offset + CUSTOMER_PAGE_SIZE >= total) return false;
  try {
    listSearch(query.q, query.offset + CUSTOMER_PAGE_SIZE);
    return true;
  } catch {
    return false;
  }
}
