import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../exceptions/api-error';

export function apiErrorMiddleware(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.status).json(err);
  } else {
    res.status(500).json(err);
    next();
  }
}
