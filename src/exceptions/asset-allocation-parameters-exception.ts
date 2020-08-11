import { ApiError } from './api-error';

export class AssetAllocationParametersException extends ApiError {
  constructor(status: number, ...messages: string[]) {
    super(status, 'AssetAllocationParametersException', ...messages);
  }
}
