import { Router } from 'express';
import { jsonBody } from '../../http/json-body.js';
import { customerController } from './controller.js';
import type { CustomerService } from './service.js';
export function customerRoutes(service: CustomerService) {
  const router = Router();
  const controller = customerController(service);
  router.post('/', ...jsonBody(), controller.create);
  router.get('/', controller.list);
  router.get('/:id', controller.detail);
  return router;
}
