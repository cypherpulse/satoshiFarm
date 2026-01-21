import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/contexts/WalletContext";
import { MarketplaceItem, SellerEarnings } from "@/lib/stacks-types";

export const useMarketplaceItems = () => {
  const { fetchItems } = useWallet();

  return useQuery<MarketplaceItem[]>({
    queryKey: ["marketplace-items"],
    queryFn: fetchItems,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useSellerEarnings = (seller: string | null) => {
  const { fetchSellerEarnings } = useWallet();

  return useQuery<SellerEarnings>({
    queryKey: ["seller-earnings", seller],
    queryFn: () => fetchSellerEarnings(seller!),
    enabled: !!seller,
    staleTime: 15000, // 15 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useRefreshMarketplace = () => {
  const queryClient = useQueryClient();

  const refreshItems = () => {
    queryClient.invalidateQueries({ queryKey: ["marketplace-items"] });
  };

  const refreshEarnings = () => {
    queryClient.invalidateQueries({ queryKey: ["seller-earnings"] });
  };

  const refreshAll = () => {
    refreshItems();
    refreshEarnings();
  };

  return { refreshItems, refreshEarnings, refreshAll };
};
