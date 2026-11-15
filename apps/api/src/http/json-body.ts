import { json, type RequestHandler } from 'express';
import { HttpError } from './errors.js';

export function jsonBody(): RequestHandler[] {
  return [
    (request, _response, next) => {
      if (!request.is('application/json'))
        throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE');
      next();
    },
    json({ limit: '32kb', strict: false }),
  ];
}
