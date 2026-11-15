import type { RequestHandler } from 'express';
import {
  parseCreateSimulation,
  parseCustomerId,
  parseSimulationQuery,
} from '@saas-o-matic/shared';
import type { SimulationService } from './service.js';

export function simulationController(service: SimulationService): {
  create: RequestHandler;
  history: RequestHandler;
} {
  return {
    history(request, response) {
      const customerId = parseCustomerId(request.params.id);
      const url = new URL(request.originalUrl, 'http://local.invalid');
      const query = parseSimulationQuery(url.searchParams.entries());
      response.json(service.history(customerId, query));
    },
    create(request, response) {
      const result = service.create(parseCreateSimulation(request.body));
      response.status(201).json(result);
    },
  };
}
