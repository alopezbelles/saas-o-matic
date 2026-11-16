import type { ApiError } from '@saas-o-matic/shared';

type FailureKind = 'network' | 'timeout' | 'http' | 'protocol';

export class ApiRequestError extends Error {
  constructor(
    readonly kind: FailureKind,
    readonly status?: number,
    readonly envelope?: ApiError['error'],
  ) {
    const messages = {
      network:
        'No se puede conectar con el servicio. Comprueba la conexión e inténtalo de nuevo.',
      timeout: 'La consulta está tardando demasiado. Vuelve a intentarlo.',
      http:
        status === 503
          ? 'El servicio no está disponible. Inténtalo de nuevo.'
          : 'No se han podido cargar los datos. Inténtalo de nuevo.',
      protocol:
        'No se han podido interpretar los datos del servicio. Inténtalo de nuevo.',
    };
    super(messages[kind]);
    this.name = 'ApiRequestError';
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function errorEnvelope(value: unknown): ApiError['error'] | undefined {
  if (!isRecord(value) || !isRecord(value.error)) return undefined;
  const error = value.error;
  if (
    typeof error.code !== 'string' ||
    !error.code ||
    typeof error.message !== 'string' ||
    typeof error.requestId !== 'string' ||
    !error.requestId
  )
    return undefined;
  if (
    error.fields !== undefined &&
    (!isRecord(error.fields) ||
      Object.values(error.fields).some((field) => typeof field !== 'string'))
  ) {
    return undefined;
  }
  return {
    code: error.code,
    message: error.message,
    requestId: error.requestId,
    ...(error.fields === undefined
      ? {}
      : { fields: error.fields as Record<string, string> }),
  };
}

/** Timeout covers both the response and its JSON body. Caller abort is preserved. */
export async function getJson(
  path: string,
  signal?: AbortSignal,
): Promise<unknown> {
  return requestJson(path, 'GET', undefined, signal);
}

export async function postJson(
  path: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<unknown> {
  return requestJson(path, 'POST', body, signal);
}

async function requestJson(
  path: string,
  method: 'GET' | 'POST',
  body: unknown,
  signal?: AbortSignal,
): Promise<unknown> {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  const controller = new AbortController();
  let abortRequest = () => {};
  const aborted = new Promise<never>((_, reject) => {
    abortRequest = () => {
      reject(new DOMException('Aborted', 'AbortError'));
      controller.abort();
    };
  });
  signal?.addEventListener('abort', abortRequest, { once: true });
  if (signal?.aborted) abortRequest();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new ApiRequestError('timeout'));
      controller.abort();
    }, 10000);
  });
  const request = (async (): Promise<unknown> => {
    let response: Response;
    try {
      response = await fetch('/api' + path, {
        method,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(method === 'POST' ? { body: JSON.stringify(body) } : {}),
        cache: 'no-store',
      });
    } catch {
      throw new ApiRequestError('network');
    }
    let payload: unknown;
    try {
      if (
        response.headers
          .get('content-type')
          ?.split(';')[0]
          ?.trim()
          .toLowerCase() !== 'application/json'
      ) {
        throw new Error('Unexpected content type');
      }
      payload = await response.json();
    } catch {
      throw new ApiRequestError(
        response.ok ? 'protocol' : 'http',
        response.status,
      );
    }
    if (!response.ok)
      throw new ApiRequestError(
        'http',
        response.status,
        errorEnvelope(payload),
      );
    if (method === 'POST' && response.status !== 201) {
      throw new ApiRequestError('protocol', response.status);
    }
    return payload;
  })();
  try {
    return await Promise.race([request, timeout, aborted]);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abortRequest);
  }
}
