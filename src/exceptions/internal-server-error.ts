import { ApiError } from './api-error';

export class InternalServerError extends ApiError {
  constructor(stack = 'Undefined') {
    super(
      500,
      'InternalServerError',
      ...stack.split('\n').map((line: string) => line.trim())
    );
  }
}
