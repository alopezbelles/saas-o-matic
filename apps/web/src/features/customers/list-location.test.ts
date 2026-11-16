import { describe, expect, it } from 'vitest';
import {
  customersReturnTo,
  listSearch,
  nextPageAllowed,
  parseListLocation,
} from './list-location';

describe('WEB-SEARCH-01 location', () => {
  it('reuses query rules with a fixed page size and safely encoded values', () => {
    expect(parseListLocation('')).toEqual({ q: '', limit: 20, offset: 0 });
    expect(parseListLocation('?q=+Empresa+&offset=020')).toEqual({
      q: 'Empresa',
      limit: 20,
      offset: 20,
    });
    expect(listSearch('A & B', 20)).toBe('?q=A+%26+B&offset=20');
    for (const search of [
      '?limit=100',
      '?q=a&q=b',
      '?offset=-1',
      '?offset=100001',
      '?offset=1.5',
    ]) {
      expect(() => parseListLocation(search)).toThrow();
    }
  });

  it('only restores validated local listing contexts', () => {
    expect(
      customersReturnTo({ returnTo: '/customers?q=Empresa&offset=20' }),
    ).toBe('/customers?q=Empresa&offset=20');
    for (const returnTo of [
      'https://example.invalid',
      '//example.invalid/customers',
      '/customers/new',
      '/customers?offset=-1',
      'javascript:alert(1)',
    ]) {
      expect(customersReturnTo({ returnTo })).toBe('/customers');
    }
    expect(customersReturnTo(null)).toBe('/customers');
  });

  it('respects total and API offset bounds for the next page', () => {
    expect(nextPageAllowed({ q: '', limit: 20, offset: 0 }, 21)).toBe(true);
    expect(nextPageAllowed({ q: '', limit: 20, offset: 0 }, 20)).toBe(false);
    expect(nextPageAllowed({ q: '', limit: 20, offset: 100000 }, 200000)).toBe(
      false,
    );
  });
});
