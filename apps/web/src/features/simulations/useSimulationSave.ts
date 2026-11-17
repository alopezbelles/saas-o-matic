import { useEffect, useRef, useState } from 'react';
import {
  InputError,
  type BillingQuote,
  type CreateSimulation,
  type SimulationDto,
} from '@saas-o-matic/shared';
import { ApiRequestError } from '../customers/api/http';
import { createSimulation } from './api/create-simulation';
import { quoteChanged } from './saved-result';
import type { ConsumptionErrors } from './consumption';

export type SaveFailure = {
  message: string;
  fields: ConsumptionErrors;
  uncertain: boolean;
};
export type SaveState =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'error'; failure: SaveFailure }
  | {
      status: 'success';
      result: SimulationDto;
      previous: BillingQuote;
      changed: boolean;
    };

function fieldsOf(fields: Record<string, string> = {}): ConsumptionErrors {
  return Object.fromEntries(
    Object.entries(fields).filter(([key]) =>
      ['users', 'storageGb', 'apiCalls'].includes(key),
    ),
  );
}
function failureOf(error: unknown): SaveFailure {
  if (error instanceof InputError)
    return {
      message: 'Revisa los consumos indicados.',
      fields: fieldsOf(error.fields),
      uncertain: false,
    };
  if (error instanceof ApiRequestError && error.kind === 'http') {
    const message =
      error.status === 422
        ? error.envelope?.code === 'TAX_COUNTRY_UNSUPPORTED'
          ? 'El país de este cliente ya no tiene una tarifa disponible. Revisa su ficha antes de volver a guardar.'
          : 'Revisa los consumos indicados.'
        : error.status === 404
          ? 'El cliente ya no está disponible. Vuelve al listado para comprobarlo.'
          : error.status === 503
            ? 'El servicio no está disponible. Tus consumos se conservan; puedes volver a intentarlo.'
            : 'No se ha podido guardar la simulación. Tus consumos se conservan.';
    return {
      message,
      fields: error.status === 422 ? fieldsOf(error.envelope?.fields) : {},
      uncertain: false,
    };
  }
  return {
    message:
      'No podemos confirmar si la simulación se ha guardado. Comprueba el historial antes de volver a enviarla.',
    fields: {},
    uncertain: true,
  };
}

export function useSimulationSave() {
  const [state, setState] = useState<SaveState>({ status: 'idle' });
  const busy = useRef(false);
  const active = useRef(true);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      controller.current?.abort();
    };
  }, []);

  async function submit(
    input: CreateSimulation | null,
    preview: BillingQuote | null,
  ) {
    if (busy.current || !input || !preview) return;
    busy.current = true;
    const body = { ...input };
    const previous = {
      ...preview,
      breakdown: preview.breakdown.map((tier) => ({ ...tier })),
    };
    setState({ status: 'pending' });
    controller.current = new AbortController();
    let confirmed = false;
    try {
      const result = await createSimulation(body, controller.current.signal);
      confirmed = true;
      if (active.current)
        setState({
          status: 'success',
          result,
          previous,
          changed: quoteChanged(previous, result),
        });
    } catch (error) {
      if (active.current)
        setState({ status: 'error', failure: failureOf(error) });
    } finally {
      if (!confirmed) busy.current = false;
    }
  }
  return {
    state,
    submit,
    reset() {
      if (state.status === 'pending') return;
      busy.current = false;
      setState({ status: 'idle' });
    },
  };
}
