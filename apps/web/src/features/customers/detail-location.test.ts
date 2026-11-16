import { expect, it } from 'vitest';
import {
  historySearch,
  nextHistoryPageAllowed,
  parseHistoryLocation,
} from './detail-location';
import { formatEuro } from './format';

it('maps historyOffset to the shared fixed-size query and rejects malformed, duplicate or unknown URL parameters', () => {
  expect(parseHistoryLocation('')).toEqual({ limit: 20, offset: 0 });
  expect(parseHistoryLocation('?historyOffset=20')).toEqual({
    limit: 20,
    offset: 20,
  });
  expect(historySearch(20)).toBe('?historyOffset=20');
  expect(historySearch()).toBe('');
  for (const value of [
    '?historyOffset=-1',
    '?historyOffset=1.5',
    '?historyOffset=100001',
    '?historyOffset=20&historyOffset=40',
    '?offset=20',
    '?historyOffset=',
  ])
    expect(() => parseHistoryLocation(value)).toThrow();
  expect(nextHistoryPageAllowed(0, 21)).toBe(true);
  expect(nextHistoryPageAllowed(20, 21)).toBe(false);
  expect(nextHistoryPageAllowed(100000, 200000)).toBe(false);
});

it('formats the stored EUR amount exactly, including zero and the safe-integer boundary', () => {
  const normalize = (value: string) => value.replace(/\s/g, ' ');
  expect(normalize(formatEuro(2591))).toBe('25,91 €');
  expect(normalize(formatEuro(0))).toBe('0,00 €');
  expect(normalize(formatEuro(Number.MAX_SAFE_INTEGER))).toBe(
    '90.071.992.547.409,91 €',
  );
});
