import { Router, json } from 'express';
import { HttpError } from '../../http/errors.js';
import { customerController } from './controller.js';
import type { CustomerService } from './service.js';
export function customerRoutes(service: CustomerService) {
  const router = Router();
  const controller = customerController(service);
  router.post(
    '/',
    (request, _response, next) => {
      if (!request.is('application/json'))
        throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE');
      next();
    },
    json({ limit: '32kb', strict: false }),
    controller.create,
  );
  router.get('/', controller.list);
  router.get('/:id', controller.detail);
  return router;
}
