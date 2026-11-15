import {
  calculateQuote,
  type CreateSimulation,
  type SimulationQuery,
  type TaxPolicy,
} from '@saas-o-matic/shared';
import { taxPolicy } from '../../config/tax-policy.js';
import type { Connection } from '../../db/connection.js';
import { createCalculatedSimulation, historyPage } from './repository.js';

export function simulationService(
  connection: () => Connection,
  policy: TaxPolicy = taxPolicy,
) {
  return {
    history(customerId: string, query: SimulationQuery) {
      return historyPage(connection(), customerId, query);
    },
    create(input: CreateSimulation) {
      return createCalculatedSimulation(connection(), input, (countryCode) =>
        calculateQuote(
          {
            users: input.users,
            storageGb: input.storageGb,
            apiCalls: input.apiCalls,
            countryCode,
          },
          policy,
        ),
      );
    },
  };
}

export type SimulationService = ReturnType<typeof simulationService>;
