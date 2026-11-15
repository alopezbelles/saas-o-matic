import {
  InputError,
  type CreateCustomer,
  type CustomerQuery,
} from '@saas-o-matic/shared';
import type { Connection } from '../../db/connection.js';
import { HttpError } from '../../http/errors.js';
import { validSpanishTaxId } from './domain/tax-id.js';
import { createCustomer, findCustomer, searchCustomers } from './repository.js';

export function customerService(connection: () => Connection) {
  return {
    create(input: CreateCustomer) {
      if (input.countryCode === 'ES' && !validSpanishTaxId(input.taxId))
        throw new InputError('TAX_ID_INVALID', {
          taxId: 'Formato o carácter de control incorrecto.',
        });
      return createCustomer(connection(), input);
    },
    list(query: CustomerQuery) {
      return searchCustomers(connection(), query);
    },
    detail(id: string) {
      const row = findCustomer(connection(), id);
      if (!row) throw new HttpError(404, 'CUSTOMER_NOT_FOUND');
      return row;
    },
  };
}
export type CustomerService = ReturnType<typeof customerService>;
