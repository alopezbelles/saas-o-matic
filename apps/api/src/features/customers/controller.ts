import type { RequestHandler } from 'express';
import {
  parseCreateCustomer,
  parseCustomerId,
  parseCustomerQuery,
} from '@saas-o-matic/shared';
import type { CustomerService } from './service.js';
export function customerController(service: CustomerService): {
  create: RequestHandler;
  list: RequestHandler;
  detail: RequestHandler;
} {
  return {
    create(request, response) {
      const customer = service.create(parseCreateCustomer(request.body));
      response
        .location('/customers/' + customer.id)
        .status(201)
        .json(customer);
    },
    list(request, response) {
      const url = new URL(request.originalUrl, 'http://local.invalid');
      response.json(
        service.list(parseCustomerQuery(url.searchParams.entries())),
      );
    },
    detail(request, response) {
      response.json(service.detail(parseCustomerId(request.params.id)));
    },
  };
}
