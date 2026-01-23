import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { connect, isConnected as stacksIsConnected, disconnect as stacksDisconnect, getLocalStorage, request } from "@stacks/connect";
import { STACKS_TESTNET } from "@stacks/network";
import { Cl, cvToValue, Pc } from "@stacks/transactions";
import { fetchCallReadOnlyFunction } from "@stacks/transactions";
import {
  MARKETPLACE_CONTRACT_ADDRESS,
  MARKETPLACE_CONTRACT_NAME,
  USDCX_CONTRACT_ADDRESS,
  USDCX_CONTRACT_NAME,
  WALLETCONNECT_PROJECT_ID,
  APP_NAME,
} from "@/lib/constants";
import {
  MarketplaceItem,
  RawMarketplaceItem,
  Transaction,
  SellerEarnings,
  BuyItemParams,
  ListItemParams,
} from "@/lib/stacks-types";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  fetchItems: () => Promise<MarketplaceItem[]>;
  fetchItem: (itemId: number) => Promise<MarketplaceItem | null>;
  fetchSellerEarnings: (seller: string) => Promise<SellerEarnings>;
  buyItem: (params: BuyItemParams) => Promise<void>;
  listItem: (params: ListItemParams) => Promise<void>;
  withdrawStx: () => Promise<void>;
  withdrawUsdcx: () => Promise<void>;
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);



export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    if (stacksIsConnected()) {
      const data = getLocalStorage();
      const stxAddress = data?.addresses?.stx?.[0]?.address;
      if (stxAddress) {
        setAddress(stxAddress);
        setIsConnected(true);
      }
    }
    const savedTx = window.localStorage.getItem("toshifarm_transactions");
    if (savedTx) {
      try {
        const parsed = JSON.parse(savedTx);
        setTransactions(parsed.map((tx: any) => ({ ...tx, timestamp: new Date(tx.timestamp) })));
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      window.localStorage.setItem("toshifarm_transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  const connectWallet = useCallback(async () => {
    try {
      await connect();
      const data = getLocalStorage();
      const stxAddress = data?.addresses?.stx?.[0]?.address;
      if (stxAddress) {
        setAddress(stxAddress);
        setIsConnected(true);
      }
    } catch (e) {
      setIsConnected(false);
      setAddress(null);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    stacksDisconnect();
    setIsConnected(false);
    setAddress(null);
  }, []);

  const addTransaction = useCallback((tx: Transaction) => {
    setTransactions(prev => [tx, ...prev].slice(0, 50));
  }, []);

  const fetchItems = useCallback(async (): Promise<MarketplaceItem[]> => {
    try {
      setIsLoading(true);
      const nextIdResult = await fetchCallReadOnlyFunction({
        network: STACKS_TESTNET,
        contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
        contractName: MARKETPLACE_CONTRACT_NAME,
        functionName: "get-next-item-id",
        functionArgs: [],
        senderAddress: MARKETPLACE_CONTRACT_ADDRESS,
      });
      const nextId = Number(cvToValue(nextIdResult));
      const items: MarketplaceItem[] = [];
      for (let id = 1; id < nextId; id++) {
        const item = await fetchItemInternal(id);
        if (item && item.active) items.push(item);
      }
      return items;
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchItemInternal = async (itemId: number): Promise<MarketplaceItem | null> => {
    try {
      const result = await fetchCallReadOnlyFunction({
        network: STACKS_TESTNET,
        contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
        contractName: MARKETPLACE_CONTRACT_NAME,
        functionName: "get-item",
        functionArgs: [Cl.uint(itemId)],
        senderAddress: MARKETPLACE_CONTRACT_ADDRESS,
      });
      const itemValue = cvToValue(result);
      if (!itemValue.value) return null; // Check if optional has value
      const item = itemValue.value;
      return {
        id: itemId,
        active: item.active?.value ?? item.active,
        name: item.name?.value ?? item.name,
        description: item.description?.value ?? item.description,
        imageUrl: item["image-url"]?.value ?? item["image-url"],
        price: BigInt(item.price?.value ?? item.price),
        quantity: Number(item.quantity?.value ?? item.quantity),
        seller: item.seller?.value ?? item.seller,
      };
    } catch (error) {
      console.error(`Error fetching item ${itemId}:`, error);
      return null;
    }
  };

  const fetchItem = useCallback(async (itemId: number) => fetchItemInternal(itemId), []);

  const fetchSellerEarnings = useCallback(async (seller: string): Promise<SellerEarnings> => {
    try {
      const [stxResult, usdcxResult] = await Promise.all([
        fetchCallReadOnlyFunction({
          network: STACKS_TESTNET, contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
          contractName: MARKETPLACE_CONTRACT_NAME, functionName: "get-seller-stx-earnings",
          functionArgs: [Cl.principal(seller)], senderAddress: seller,
        }),
        fetchCallReadOnlyFunction({
          network: STACKS_TESTNET, contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
          contractName: MARKETPLACE_CONTRACT_NAME, functionName: "get-seller-usdcx-earnings",
          functionArgs: [Cl.principal(seller)], senderAddress: seller,
        }),
      ]);
      return { stx: BigInt(cvToValue(stxResult) || 0), usdcx: BigInt(cvToValue(usdcxResult) || 0) };
    } catch { return { stx: BigInt(0), usdcx: BigInt(0) }; }
  }, []);

  const buyItem = useCallback(async (params: BuyItemParams) => {
    if (!isConnected) throw new Error("Wallet not connected");

    // Get item details to calculate price
    const item = await fetchItemInternal(params.itemId);
    if (!item) throw new Error("Item not found");

    const usdcxPrice = Number(item.price) * params.quantity;
    const stxPrice = Math.ceil(usdcxPrice * 2.6);
    const paymentAmount = params.useStx ? stxPrice : usdcxPrice;

    const response = await request('stx_callContract', {
      contract: `${MARKETPLACE_CONTRACT_ADDRESS}.${MARKETPLACE_CONTRACT_NAME}`,
      functionName: "buy-item",
      functionArgs: [
        Cl.uint(params.itemId),
        Cl.uint(params.quantity),
        Cl.bool(params.useStx)
      ],
      network: STACKS_TESTNET.chainId === 2147483648 ? 'testnet' : 'mainnet',
      postConditionMode: 'allow'
    });

    addTransaction({
      id: response.txid,
      type: 'purchase',
      itemId: params.itemId,
      itemName: item.name,
      quantity: params.quantity,
      amount: paymentAmount,
      paymentMethod: params.useStx ? "STX" : "USDCx",
      timestamp: new Date(),
      status: 'pending',
      txId: response.txid
    });
  }, [isConnected, addTransaction]);

  const listItem = useCallback(async (params: ListItemParams) => {
    if (!isConnected) throw new Error("Wallet not connected");
    const response = await request('stx_callContract', {
      contract: `${MARKETPLACE_CONTRACT_ADDRESS}.${MARKETPLACE_CONTRACT_NAME}`,
      functionName: "list-item",
      functionArgs: [
        Cl.stringAscii(params.name), Cl.stringAscii(params.description),
        Cl.stringAscii(params.imageUrl), Cl.uint(params.price), Cl.uint(params.quantity),
      ],
      network: STACKS_TESTNET.chainId === 2147483648 ? 'testnet' : 'mainnet',
      postConditionMode: 'allow'
    });
    addTransaction({
      id: response.txid,
      type: 'list',
      amount: params.quantity,
      timestamp: new Date(),
      status: 'pending'
    });
  }, [isConnected, addTransaction]);

  const withdrawStx = useCallback(async () => {
    if (!isConnected || !address) throw new Error("Wallet not connected");

    // Check if user has STX earnings before attempting withdrawal
    const earnings = await fetchSellerEarnings(address);
    if (earnings.stx <= BigInt(0)) {
      throw new Error("No STX earnings available to withdraw");
    }

    const response = await request('stx_callContract', {
      contract: `${MARKETPLACE_CONTRACT_ADDRESS}.${MARKETPLACE_CONTRACT_NAME}`,
      functionName: "withdraw-stx",
      functionArgs: [],
      network: STACKS_TESTNET.chainId === 2147483648 ? 'testnet' : 'mainnet',
      postConditionMode: 'allow'
    });
    addTransaction({
      id: response.txid,
      type: 'withdraw-stx',
      amount: Number(earnings.stx),
      timestamp: new Date(),
      status: 'pending'
    });
  }, [isConnected, address, addTransaction, fetchSellerEarnings]);

  const withdrawUsdcx = useCallback(async () => {
    if (!isConnected || !address) throw new Error("Wallet not connected");

    try {
      // Check if user has USDCx earnings before attempting withdrawal
      const earnings = await fetchSellerEarnings(address);
      console.log("USDCx earnings:", earnings.usdcx.toString());
      if (earnings.usdcx <= BigInt(0)) {
        throw new Error("No USDCx earnings available to withdraw");
      }

      console.log("Attempting USDCx withdrawal with earnings:", earnings.usdcx.toString());
      console.log("Network chainId:", STACKS_TESTNET.chainId);
      console.log("Using network:", STACKS_TESTNET.chainId === 2147483648 ? 'testnet' : 'mainnet');

      const response = await request('stx_callContract', {
        contract: `${MARKETPLACE_CONTRACT_ADDRESS}.${MARKETPLACE_CONTRACT_NAME}`,
        functionName: "withdraw-usdcx",
        functionArgs: [],
        network: STACKS_TESTNET.chainId === 2147483648 ? 'testnet' : 'mainnet',
        postConditionMode: 'allow'
      });

      console.log("USDCx withdrawal response:", response);
      console.log("USDCx withdrawal transaction submitted:", response.txid);

      addTransaction({
        id: response.txid,
        type: 'withdraw-usdcx',
        amount: Number(earnings.usdcx),
        timestamp: new Date(),
        status: 'pending'
      });
    } catch (error) {
      console.error("USDCx withdrawal error:", error);
      throw error;
    }
  }, [isConnected, address, addTransaction, fetchSellerEarnings]);

  return (
    <WalletContext.Provider value={{
      isConnected, address, connectWallet, disconnectWallet, fetchItems, fetchItem,
      fetchSellerEarnings, buyItem, listItem, withdrawStx, withdrawUsdcx,
      transactions, addTransaction, isLoading,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within a WalletProvider");
  return context;
};
