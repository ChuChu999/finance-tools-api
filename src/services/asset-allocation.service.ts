import { AssetAllocationParametersException } from '../exceptions/asset-allocation-parameters.exception';
import { AssetAllocation } from '../models/asset-allocation';
import { YahooFinanceService } from './yahoo-finance.service';

export class AssetAllocationService {
  private financeDataService: YahooFinanceService = new YahooFinanceService();

  /**
   * Calculate the asset allocation
   *
   * @param symbolList A list of ticker symbols
   * @param sharesList A list of share quantities
   * @return A list of asset allocations
   */
  async calculateAssetAllocations(
    symbolList: string[],
    sharesList: number[]
  ): Promise<AssetAllocation[]> {
    if (symbolList.length !== sharesList.length) {
      throw new AssetAllocationParametersException(
        400,
        'Symbols and shares must be the same length!'
      );
    }

    symbolList.forEach((symbol: string) => {
      if (symbol === '') {
        throw new AssetAllocationParametersException(
          400,
          'Symbols must be defined!'
        );
      }
    });

    const prices: number[] = await this.financeDataService.fetchPrices(
      symbolList
    );

    const totalValue: number = prices.reduce(
      (accumulator: number, currentPrice: number, currentIndex: number) => {
        return accumulator + sharesList[currentIndex] * currentPrice;
      },
      0
    );

    const assetAllocations: AssetAllocation[] = [];

    symbolList.forEach((symbol, index) => {
      const shares: number = sharesList[index];
      const price: number = prices[index];
      const currentWeight: number = ((shares * price) / totalValue) * 100;

      assetAllocations.push(
        new AssetAllocation(
          symbol.toUpperCase(),
          parseFloat(shares.toFixed(2)),
          parseFloat(price.toFixed(2)),
          parseFloat(currentWeight.toFixed(2))
        )
      );
    });

    return assetAllocations;
  }

  /**
   * Calculate the asset allocation including share deltas
   *
   * @param symbolList A list of ticker symbols
   * @param sharesList A list of share quantities
   * @param targetWeights A list of target weights as percentages
   * @param contribution The contribution amount
   * @return A list of asset allocations including share deltas
   */
  async calculateAssetAllocationWithDeltas(
    symbolList: string[],
    sharesList: number[],
    targetWeights: number[],
    contribution: number
  ): Promise<AssetAllocation[]> {
    if (
      !(
        symbolList.length === sharesList.length &&
        sharesList.length === targetWeights.length
      )
    ) {
      throw new AssetAllocationParametersException(
        400,
        'Symbols, shares, and target weights must be the same length!'
      );
    }

    const totalWeight: number = targetWeights.reduce(
      (accumulator: number, currentWeight: number) => {
        return accumulator + currentWeight;
      },
      0
    );

    if (totalWeight !== 100) {
      throw new AssetAllocationParametersException(
        400,
        'Target weights must sum to 100%!'
      );
    }

    const assetAllocations: AssetAllocation[] = await this.calculateAssetAllocations(
      symbolList,
      sharesList
    );

    const totalValue: number = assetAllocations.reduce(
      (
        accumulator: number,
        currentAsset: AssetAllocation,
        currentIndex: number
      ) => {
        return accumulator + sharesList[currentIndex] * currentAsset.price;
      },
      0
    );

    assetAllocations.forEach(
      (assetAllocation: AssetAllocation, index: number) => {
        const value: number = assetAllocation.shares * assetAllocation.price;
        const targetWeight = targetWeights[index];

        const priceDelta: number =
          (contribution + totalValue) * (targetWeight / 100) - value;

        const shareDelta: number = priceDelta / assetAllocation.price;

        assetAllocation.targetWeight = parseFloat(targetWeight.toFixed(2));
        assetAllocation.shareDelta = parseFloat(shareDelta.toFixed(2));
      }
    );

    return assetAllocations;
  }
}
