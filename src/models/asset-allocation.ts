export class AssetAllocation {
  symbol: string;
  shares: number;
  price: number;
  currentWeight: number;
  targetWeight?: number;
  shareDelta?: number;

  constructor(
    symbol: string,
    shares: number,
    price: number,
    currentWeight: number,
    targetWeight?: number,
    shareDelta?: number
  ) {
    this.symbol = symbol;
    this.shares = shares;
    this.price = price;
    this.currentWeight = currentWeight;
    this.targetWeight = targetWeight;
    this.shareDelta = shareDelta;
  }
}
