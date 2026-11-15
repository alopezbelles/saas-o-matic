import { Router } from 'express';
import { jsonBody } from '../../http/json-body.js';
import { simulationController } from './controller.js';
import type { SimulationService } from './service.js';

export function simulationRoutes(service: SimulationService) {
  const router = Router();
  router.post('/', ...jsonBody(), simulationController(service).create);
  return router;
}

export function simulationHistoryRoutes(service: SimulationService) {
  const router = Router();
  router.get('/:id/simulations', simulationController(service).history);
  return router;
}
