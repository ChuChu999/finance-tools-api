import { ApiError } from './api-error';

export class AssetAllocationParametersException extends ApiError {
  constructor(status: number, ...messages: string[]) {
    super(status, 'Asset allocation parameters exception!', ...messages);
  }
}
