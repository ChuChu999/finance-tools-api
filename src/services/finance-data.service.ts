import axios from 'axios';
import { FinanceDataFetchPriceException } from '../exceptions/finance-data-fetch-price-exception';
import { YahooFinanceQuoteResponse } from '../models/yahoo-finance-quote-response';

export class FinanceDataService {
  /**
   * Fetch the prices of a list of stocks
   *
   * @param symbols The ticker symbols to fetch
   * @return A list of prices
   */
  async fetchPrices(symbols: string[]): Promise<number[]> {
    const quoteEndpoint = 'https://query2.finance.yahoo.com/v7/finance/quote';
    const joinedSymbols: string = symbols.join();

    const response = await axios.get(quoteEndpoint, {
      params: {
        symbols: joinedSymbols,
        fields: 'regularMarketPrice',
      },
    });

    const quotes: YahooFinanceQuoteResponse[] =
      response.data.quoteResponse.result;

    if (quotes.length !== symbols.length) {
      symbols.map((symbol: string, index: number) => {
        if (
          index >= quotes.length ||
          quotes[index].symbol.toUpperCase() !== symbol.toUpperCase()
        ) {
          throw new FinanceDataFetchPriceException(symbol);
        }
      });
    }

    const prices: number[] = response.data.quoteResponse.result.map(
      (quote: { regularMarketPrice: number }) => quote.regularMarketPrice
    );

    return prices;
  }
}
