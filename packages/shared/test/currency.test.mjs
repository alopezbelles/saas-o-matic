import assert from 'node:assert/strict';
import test from 'node:test';
import { convertCurrency, CurrencyError } from '../dist/index.js';
import {
  conversionCases,
  invalidAmounts,
  invalidRates,
  unsupportedCurrencies,
  overflowCase,
} from './currency-fixtures.mjs';

const fails = (input, code) =>
  assert.throws(
    () => convertCurrency(input),
    (error) => error instanceof CurrencyError && error.code === code,
  );

test('006-T02: conversion matches independent fixtures and returns minor units', () => {
  for (const { amountMinor, ...input } of conversionCases) {
    assert.deepEqual(convertCurrency(input), {
      amountMinor,
      currency: input.targetCurrency,
      exponent: 2,
    });
  }
});

test('006-T02: EUR is identity without a rate, including zero and safe maximum', () => {
  for (const amountEurCents of [0, 1, 16940, Number.MAX_SAFE_INTEGER]) {
    assert.deepEqual(
      convertCurrency({ amountEurCents, targetCurrency: 'EUR' }),
      {
        amountMinor: amountEurCents,
        currency: 'EUR',
        exponent: 2,
      },
    );
  }
});

test('006-T02: half-up rounds only the final exact product', () => {
  for (const [rate, expected] of [
    ['0.49999999999999999', 0],
    ['0.5', 1],
    ['0.50000000000000001', 1],
    ['1.005', 1],
  ]) {
    assert.equal(
      convertCurrency({ amountEurCents: 1, targetCurrency: 'USD', rate })
        .amountMinor,
      expected,
    );
  }
  assert.equal(
    convertCurrency({
      amountEurCents: 100,
      targetCurrency: 'USD',
      rate: '1.005',
    }).amountMinor,
    101,
  );
});

test('006-T02: decimal and scientific forms are equivalent without monetary floating arithmetic', () => {
  for (const rate of ['1.1', '11e-1', '0.11E+1', '001.100', '110e-2']) {
    assert.equal(
      convertCurrency({ amountEurCents: 16940, targetCurrency: 'USD', rate })
        .amountMinor,
      18634,
    );
  }
  assert.equal(
    convertCurrency({
      amountEurCents: 1,
      targetCurrency: 'USD',
      rate: '5e-324',
    }).amountMinor,
    0,
  );
});

test('006-T02: invalid inputs and unsupported currencies fail without coercion', () => {
  for (const amountEurCents of [...invalidAmounts, undefined, {}, 1n]) {
    fails({ amountEurCents, targetCurrency: 'EUR' }, 'CURRENCY_AMOUNT_INVALID');
  }
  for (const input of [null, undefined, [], 1])
    fails(input, 'CURRENCY_AMOUNT_INVALID');
  for (const targetCurrency of [
    ...unsupportedCurrencies,
    'toString',
    '__proto__',
    undefined,
  ]) {
    fails(
      { amountEurCents: 100, targetCurrency, rate: '1' },
      'CURRENCY_UNSUPPORTED',
    );
  }
});

test('006-T02: invalid or excessive rate representations fail before BigInt expansion', () => {
  for (const rate of [
    ...invalidRates,
    undefined,
    '1e309',
    '1e-325',
    '1e999999999999',
    '1'.repeat(65),
    '.5',
    '1.',
    '+1',
    '1\n',
    '0x10',
    {},
    1n,
  ]) {
    fails(
      { amountEurCents: 100, targetCurrency: 'USD', rate },
      'CURRENCY_RATE_INVALID',
    );
  }
  // At the supported text-length boundary, leading zeros do not change value.
  assert.equal(
    convertCurrency({
      amountEurCents: 100,
      targetCurrency: 'USD',
      rate: '0'.repeat(63) + '1',
    }).amountMinor,
    100,
  );
});

test('006-T02: safe-range checks occur after exact rounding, including large intermediates', () => {
  fails(overflowCase, 'CURRENCY_MONEY_OVERFLOW');
  assert.equal(
    convertCurrency({
      amountEurCents: Number.MAX_SAFE_INTEGER,
      targetCurrency: 'GBP',
      rate: '1',
    }).amountMinor,
    Number.MAX_SAFE_INTEGER,
  );
  assert.equal(
    convertCurrency({
      amountEurCents: Number.MAX_SAFE_INTEGER,
      targetCurrency: 'USD',
      rate: '0.5',
    }).amountMinor,
    4503599627370496,
  );
  assert.equal(
    convertCurrency({ amountEurCents: 0, targetCurrency: 'USD', rate: '1e308' })
      .amountMinor,
    0,
  );
});

test('006-T02: frozen inputs stay intact and calls are deterministic and independent', () => {
  const input = Object.freeze({
    amountEurCents: 16940,
    targetCurrency: 'USD',
    rate: '1.1',
  });
  const first = convertCurrency(input);
  first.amountMinor = 0;
  assert.equal(convertCurrency(input).amountMinor, 18634);
  assert.deepEqual(input, {
    amountEurCents: 16940,
    targetCurrency: 'USD',
    rate: '1.1',
  });
});
