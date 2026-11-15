import { InputError } from './input-error.js';

export function queryValues(
  entries: Iterable<[string, string]>,
  allowed: readonly string[],
): Map<string, string> {
  const values = new Map<string, string>();
  for (const [key, value] of entries) {
    if (!allowed.includes(key) || values.has(key))
      throw new InputError('INVALID_QUERY');
    values.set(key, value);
  }
  return values;
}

export function parsePagination(values: ReadonlyMap<string, string>) {
  function number(key: string, fallback: number, min: number, max: number) {
    const value = values.get(key);
    if (value === undefined) return fallback;
    if (
      !/^[0-9]+$/.test(value) ||
      !Number.isSafeInteger(Number(value)) ||
      Number(value) < min ||
      Number(value) > max
    )
      throw new InputError('INVALID_QUERY');
    return Number(value);
  }
  return {
    limit: number('limit', 20, 1, 100),
    offset: number('offset', 0, 0, 100000),
  };
}
