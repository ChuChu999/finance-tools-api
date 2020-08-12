import { ApiError } from './api.error';

export class YahooFinanceQuoteException extends ApiError {
  constructor(symbol: string) {
    super(
      500,
      'YahooFinanceQuoteException',
      `Could not fetch quote for symbol '${symbol}'`
    );
  }
}
