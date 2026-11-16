import { ApiRequestError, isRecord } from './http';

export function parsePage<T extends { id: string }>(
  value: unknown,
  query: { limit: number; offset: number },
  parseItem: (value: unknown) => T,
) {
  if (
    !isRecord(value) ||
    !Array.isArray(value.items) ||
    typeof value.total !== 'number' ||
    !Number.isSafeInteger(value.total) ||
    value.total < 0 ||
    value.limit !== query.limit ||
    value.offset !== query.offset ||
    value.items.length !==
      Math.min(query.limit, Math.max(value.total - query.offset, 0))
  ) {
    throw new ApiRequestError('protocol');
  }
  const items = value.items.map(parseItem);
  if (new Set(items.map((item) => item.id)).size !== items.length)
    throw new ApiRequestError('protocol');
  return {
    items,
    total: value.total,
    limit: query.limit,
    offset: query.offset,
  };
}
