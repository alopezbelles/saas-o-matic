import assert from 'node:assert/strict';
import test from 'node:test';
import { validSpanishTaxId } from '../dist/features/customers/domain/tax-id.js';
import { validIds, invalidIds } from './tax-id-fixtures.mjs';
test('UT-FISC-01: fixtures independientes de todas las familias y control por prefijo', () => {
  for (const id of validIds) {
    assert.equal(validSpanishTaxId(id), true, id);
    assert.equal(validSpanishTaxId(id.toLowerCase()), true, id);
  }
  for (const id of invalidIds) assert.equal(validSpanishTaxId(id), false, id);
  for (const id of validIds)
    assert.equal(validSpanishTaxId(id.slice(0, 8) + 'O'), false, id);
});
