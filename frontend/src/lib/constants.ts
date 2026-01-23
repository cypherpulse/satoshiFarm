// Contract addresses (Stacks Testnet)
export const MARKETPLACE_CONTRACT_ADDRESS = "STGDS0Y17973EN5TCHNHGJJ9B31XWQ5YXBQ0KQ2Y";
export const MARKETPLACE_CONTRACT_NAME = "toshi-farm-v2";
export const USDCX_CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
export const USDCX_CONTRACT_NAME = "usdcx";

// Full contract identifier
export const MARKETPLACE_CONTRACT = `${MARKETPLACE_CONTRACT_ADDRESS}.${MARKETPLACE_CONTRACT_NAME}`;
export const USDCX_CONTRACT = `${USDCX_CONTRACT_ADDRESS}.${USDCX_CONTRACT_NAME}`;

// WalletConnect Project ID - Replace with your own from cloud.reown.com
export const WALLETCONNECT_PROJECT_ID = "YOUR_PROJECT_ID_HERE";

// App info for wallet connection
export const APP_NAME = "Satoshi Farm";
export const APP_ICON = "/favicon.ico";

// Conversion constants
export const MICRO_UNITS = 1_000_000;

// Format micro amounts to readable format
export const formatAmount = (microAmount: number | bigint): string => {
  const amount = Number(microAmount) / MICRO_UNITS;
  return amount.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 6 
  });
};

// Convert readable amount to micro units
export const toMicroUnits = (amount: number): number => {
  return Math.floor(amount * MICRO_UNITS);
};

// Shorten address for display
export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};
