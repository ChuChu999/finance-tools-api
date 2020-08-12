import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../exceptions/api.error';
import { InternalServerError } from '../exceptions/internal-server.error';

export function apiErrorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.status).json(err);
  } else {
    res.status(500).json(new InternalServerError(err.stack));
    next(err);
  }
}
