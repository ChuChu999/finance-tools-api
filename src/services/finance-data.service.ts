import axios from 'axios';
import { FinanceDataFetchPriceException } from '../exceptions/finance-data-fetch-price-exception';

export class FinanceDataService {
  private quoteEndpoint = 'https://query2.finance.yahoo.com/v7/finance/quote';

  /**
   * Fetch the prices of a list of stocks
   *
   * @param symbols The ticker symbols to fetch
   * @return A list of prices
   */
  async fetchPrices(symbols: string[]): Promise<number[]> {
    const joinedSymbols = symbols.join();
    const quoteUrl = `${this.quoteEndpoint}?symbols=${joinedSymbols}&fields=regularMarketPrice`;
    const response = await axios.get(quoteUrl);
    const quotes: { regularMarketPrice: number; symbol: string }[] =
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
