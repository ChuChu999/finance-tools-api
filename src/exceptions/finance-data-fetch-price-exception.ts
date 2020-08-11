import { ApiError } from './api-error';

export class FinanceDataFetchPriceException extends ApiError {
  constructor(symbol: string) {
    super(
      500,
      'FinanceDataFetchPriceException',
      `Could not fetch price for symbol '${symbol}'`
    );
  }
}
