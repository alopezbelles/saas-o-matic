import {
  parseCreateSimulation,
  type CreateSimulation,
} from '@saas-o-matic/shared';
import { ApiRequestError, postJson } from '../../customers/api/http';
import { parseSimulationDto } from '../../customers/api/simulations';

export async function createSimulation(
  input: CreateSimulation,
  signal?: AbortSignal,
) {
  const body = parseCreateSimulation(input);
  const value = await postJson('/simulations', body, signal);
  try {
    const result = parseSimulationDto(value, body.customerId);
    if (
      result.users !== body.users ||
      result.storageGb !== body.storageGb ||
      result.apiCalls !== body.apiCalls
    )
      throw new Error('Unexpected consumption');
    return result;
  } catch {
    throw new ApiRequestError('protocol', 201);
  }
}
