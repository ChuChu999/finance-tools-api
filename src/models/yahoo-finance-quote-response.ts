import { YahooFinanceQuote } from './yahoo-finance-quote';

export interface YahooFinanceQuoteResponse {
  data: {
    quoteResponse: {
      result: YahooFinanceQuote[];
    };
  };

  error: string;
}
