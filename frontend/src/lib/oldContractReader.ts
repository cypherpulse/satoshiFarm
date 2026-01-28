import { fetchCallReadOnlyFunction } from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";
import { Cl, cvToValue } from "@stacks/transactions";
import {
  MARKETPLACE_CONTRACT_ADDRESS_V1,
  MARKETPLACE_CONTRACT_NAME_V1,
} from "@/lib/constants";
import { MarketplaceItem, SellerEarnings } from "@/lib/stacks-types";

export class OldContractDataReader {
  /**
   * Fetch all items from the old toshi-farm contract
   */
  static async fetchAllItemsFromOldContract(): Promise<MarketplaceItem[]> {
    try {
      console.log("Fetching items from old contract...");

      // Get the next item ID to know how many items to fetch
      const nextIdResult = await fetchCallReadOnlyFunction({
        network: STACKS_TESTNET,
        contractAddress: MARKETPLACE_CONTRACT_ADDRESS_V1,
        contractName: MARKETPLACE_CONTRACT_NAME_V1,
        functionName: "get-next-item-id",
        functionArgs: [],
        senderAddress: MARKETPLACE_CONTRACT_ADDRESS_V1,
      });

      const nextId = Number(cvToValue(nextIdResult));
      console.log(`Old contract has ${nextId - 1} items to fetch`);

      const items: MarketplaceItem[] = [];

      // Fetch each item (starting from ID 1)
      for (let id = 1; id < nextId; id++) {
        try {
          const item = await this.fetchItemFromOldContract(id);
          if (item && item.active) {
            items.push(item);
          }
        } catch (error) {
          console.warn(`Failed to fetch item ${id} from old contract:`, error);
        }
      }

      console.log(`Successfully fetched ${items.length} active items from old contract`);
      return items;
    } catch (error) {
      console.error("Error fetching items from old contract:", error);
      return [];
    }
  }

  /**
   * Fetch a specific item from the old contract
   */
  static async fetchItemFromOldContract(itemId: number): Promise<MarketplaceItem | null> {
    try {
      const result = await fetchCallReadOnlyFunction({
        network: STACKS_TESTNET,
        contractAddress: MARKETPLACE_CONTRACT_ADDRESS_V1,
        contractName: MARKETPLACE_CONTRACT_NAME_V1,
        functionName: "get-item",
        functionArgs: [Cl.uint(itemId)],
        senderAddress: MARKETPLACE_CONTRACT_ADDRESS_V1,
      });

      const itemValue = cvToValue(result);
      if (!itemValue.value) return null;

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
      console.error(`Error fetching item ${itemId} from old contract:`, error);
      return null;
    }
  }

  /**
   * Fetch user earnings from the old contract
   */
  static async fetchUserEarningsFromOldContract(seller: string): Promise<SellerEarnings> {
    try {
      console.log(`Fetching earnings for ${seller} from old contract...`);

      const [stxResult, usdcxResult] = await Promise.all([
        fetchCallReadOnlyFunction({
          network: STACKS_TESTNET,
          contractAddress: MARKETPLACE_CONTRACT_ADDRESS_V1,
          contractName: MARKETPLACE_CONTRACT_NAME_V1,
          functionName: "get-seller-stx-earnings",
          functionArgs: [Cl.principal(seller)],
          senderAddress: seller,
        }),
        fetchCallReadOnlyFunction({
          network: STACKS_TESTNET,
          contractAddress: MARKETPLACE_CONTRACT_ADDRESS_V1,
          contractName: MARKETPLACE_CONTRACT_NAME_V1,
          functionName: "get-seller-usdcx-earnings",
          functionArgs: [Cl.principal(seller)],
          senderAddress: seller,
        }),
      ]);

      const earnings = {
        stx: BigInt(cvToValue(stxResult) || 0),
        usdcx: BigInt(cvToValue(usdcxResult) || 0),
      };

      console.log(`Old contract earnings for ${seller}:`, {
        stx: earnings.stx.toString(),
        usdcx: earnings.usdcx.toString(),
      });

      return earnings;
    } catch (error) {
      console.error(`Error fetching earnings for ${seller} from old contract:`, error);
      return { stx: BigInt(0), usdcx: BigInt(0) };
    }
  }

  /**
   * Get a summary of all data from the old contract
   */
  static async getOldContractDataSummary(userAddress?: string) {
    console.log("🔍 Analyzing old contract data...");

    const items = await this.fetchAllItemsFromOldContract();

    let userEarnings = { stx: BigInt(0), usdcx: BigInt(0) };
    if (userAddress) {
      userEarnings = await this.fetchUserEarningsFromOldContract(userAddress);
    }

    const summary = {
      totalItems: items.length,
      userEarnings,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price.toString(),
        seller: item.seller,
      })),
    };

    console.log("📊 Old Contract Data Summary:");
    console.log(`   • Total Items: ${summary.totalItems}`);
    if (userAddress) {
      console.log(`   • Your STX Earnings: ${summary.userEarnings.stx.toString()}`);
      console.log(`   • Your USDCx Earnings: ${summary.userEarnings.usdcx.toString()}`);
    }

    return summary;
  }
}</content>
<parameter name="filePath">g:\2026\Hackhathons\doraHacks\satoshiFarm\frontend\src\lib\oldContractReader.ts