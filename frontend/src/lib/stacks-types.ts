// Types for Stacks contract interactions

export interface MarketplaceItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: bigint;
  quantity: number;
  seller: string;
  active: boolean;
}

export interface RawMarketplaceItem {
  active: boolean;
  description: string;
  "image-url": string;
  name: string;
  price: bigint;
  quantity: bigint;
  seller: string;
}

export interface Transaction {
  id: string;
  type: "purchase" | "listing" | "withdrawal";
  itemId?: number;
  itemName?: string;
  quantity?: number;
  amount: number;
  paymentMethod: "STX" | "USDCx";
  timestamp: Date;
  status: "pending" | "success" | "failed";
  txId?: string;
}

export interface SellerEarnings {
  stx: bigint;
  usdcx: bigint;
}

export type PaymentMethod = "STX" | "USDCx";

export interface BuyItemParams {
  itemId: number;
  quantity: number;
  useStx: boolean;
}

export interface ListItemParams {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
}
