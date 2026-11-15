import type { ErrorRequestHandler } from 'express';
import { BillingError, InputError } from '@saas-o-matic/shared';
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
  ) {
    super(code);
  }
}
const messages: Record<string, string> = {
  INVALID_JSON: 'El cuerpo JSON no es válido.',
  INVALID_QUERY: 'La consulta no es válida.',
  INVALID_CUSTOMER_ID: 'El identificador de cliente no es válido.',
  PAYLOAD_TOO_LARGE: 'La petición supera el tamaño admitido.',
  UNSUPPORTED_MEDIA_TYPE: 'Se requiere application/json.',
  VALIDATION_ERROR: 'Revisa los campos indicados.',
  TAX_ID_INVALID: 'El formato o carácter de control fiscal no es válido.',
  CUSTOMER_NOT_FOUND: 'Cliente no encontrado.',
  TAX_COUNTRY_UNSUPPORTED:
    'El país del cliente no tiene una tarifa fiscal configurada.',
  ROUTE_NOT_FOUND: 'Ruta no encontrada.',
  CUSTOMER_TAX_ID_CONFLICT:
    'Ya existe un cliente con ese identificador fiscal en el país.',
  DATABASE_UNAVAILABLE:
    'Base de datos no disponible. Inicialízala mediante el comando correspondiente.',
  DATABASE_BUSY: 'La base de datos está ocupada. Inténtalo de nuevo.',
  INTERNAL_ERROR: 'No se ha podido completar la operación.',
};
export function databaseError(error: unknown): never {
  let current = error;
  for (
    let depth = 0;
    depth < 5 && current && typeof current === 'object';
    depth++
  ) {
    if ('code' in current) {
      if (current.code === 'SQLITE_BUSY')
        throw new HttpError(503, 'DATABASE_BUSY');
      if (
        current.code === 'SQLITE_CONSTRAINT_UNIQUE' &&
        'message' in current &&
        current.message ===
          'UNIQUE constraint failed: customers.country_code, customers.tax_id_normalized'
      )
        throw new HttpError(409, 'CUSTOMER_TAX_ID_CONFLICT');
    }
    current = 'cause' in current ? current.cause : undefined;
  }
  throw error;
}
export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  next,
) => {
  if (response.headersSent) {
    next(error);
    return;
  }
  let status = 500,
    code = 'INTERNAL_ERROR';
  let fields: Record<string, string> | undefined;
  if (error instanceof HttpError) {
    status = error.status;
    code = error.code;
  } else if (error instanceof InputError) {
    code = error.code;
    status = ['INVALID_QUERY', 'INVALID_CUSTOMER_ID'].includes(code)
      ? 400
      : 422;
    if (Object.keys(error.fields).length) fields = error.fields;
  } else if (error instanceof BillingError) {
    if (error.code === 'TAX_COUNTRY_UNSUPPORTED') {
      status = 422;
      code = error.code;
      fields = { customerId: messages.TAX_COUNTRY_UNSUPPORTED! };
    } else if (error.code === 'BILLING_INPUT_INVALID') {
      status = 422;
      code = 'VALIDATION_ERROR';
      if (
        error.field &&
        ['users', 'storageGb', 'apiCalls'].includes(error.field)
      )
        fields = { [error.field]: 'Consumo no válido.' };
    } else {
      // Technical code for the server log; the public response remains sanitized.
      response.locals.errorCode = error.code;
    }
  } else if (error && typeof error === 'object' && 'type' in error) {
    if (error.type === 'entity.too.large') {
      status = 413;
      code = 'PAYLOAD_TOO_LARGE';
    } else if (
      [
        'entity.parse.failed',
        'request.aborted',
        'request.size.invalid',
      ].includes(String(error.type))
    ) {
      status = 400;
      code = 'INVALID_JSON';
    } else if (
      ['charset.unsupported', 'encoding.unsupported'].includes(
        String(error.type),
      )
    ) {
      status = 415;
      code = 'UNSUPPORTED_MEDIA_TYPE';
    }
  }
  response.locals.errorCode ??= code;
  response.status(status).json({
    error: {
      code,
      message: messages[code] ?? messages.INTERNAL_ERROR,
      requestId: response.locals.requestId,
      ...(fields ? { fields } : {}),
    },
  });
};
