import type { RequestHandler } from 'express';
import { parseCreateSimulation } from '@saas-o-matic/shared';
import type { SimulationService } from './service.js';

export function simulationController(service: SimulationService): {
  create: RequestHandler;
} {
  return {
    create(request, response) {
      const result = service.create(parseCreateSimulation(request.body));
      response.status(201).json(result);
    },
  };
}
