import express from 'express';
import { randomUUID } from 'node:crypto';
import { customerRoutes } from './features/customers/routes.js';
import { customerService } from './features/customers/service.js';
import type { Connection } from './db/connection.js';
import { errorHandler, HttpError } from './http/errors.js';

export type RequestLog = {
  requestId: string;
  method: string;
  status: number;
  code: string;
};
export function createApp(
  options: {
    connection?: () => Connection;
    logger?: (entry: RequestLog) => void;
  } = {},
) {
  const app = express();
  app.disable('x-powered-by');
  app.use((request, response, next) => {
    const requestId = randomUUID();
    response.locals.requestId = requestId;
    response.setHeader('X-Request-Id', requestId);
    response.on('finish', () => {
      const entry: RequestLog = {
        requestId,
        method: request.method,
        status: response.statusCode,
        code: String(response.locals.errorCode ?? 'OK'),
      };
      if (options.logger) options.logger(entry);
      else console.info(JSON.stringify(entry));
    });
    next();
  });
  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });
  app.use(
    '/customers',
    customerRoutes(
      customerService(
        options.connection ??
          (() => {
            throw new HttpError(503, 'DATABASE_UNAVAILABLE');
          }),
      ),
    ),
  );
  app.use(() => {
    throw new HttpError(404, 'ROUTE_NOT_FOUND');
  });
  app.use(errorHandler);
  return app;
}
