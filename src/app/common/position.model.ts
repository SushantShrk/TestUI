export interface Trade {
  transactionID?: number;
  tradeID?: number;
  version?: number;
  securityCode: string; // REL, TCS, INFY, etc.
  quantity: number;
  operationType: string; // Insert, Update, Cancel
  tradeType: string;     // Buy or Sell
}