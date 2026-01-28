import { useState, useMemo } from "react";
import { Bitcoin, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import ItemCard from "@/components/ItemCard";
import BuyModal from "@/components/BuyModal";
import SearchFilter from "@/components/SearchFilter";
import { useMarketplaceItems } from "@/hooks/useMarketplace";
import { MarketplaceItem } from "@/lib/stacks-types";

const Index = () => {
  const { data: items = [], isLoading, error } = useMarketplaceItems();
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter((item) => item.quantity > 0);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "quantity":
        result.sort((a, b) => b.quantity - a.quantity);
        break;
      case "newest":
      default:
        result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [items, searchTerm, sortBy, inStockOnly]);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-8">
          {/* Left side - Image */}
          <div className="flex-shrink-0">
            <img
              src="https://i.pinimg.com/1200x/64/24/b1/6424b18b9cf53638840b10fb4e772cfb.jpg"
              alt="Organic farming illustration"
              className="w-80 h-80 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          {/* Right side - Content */}
          <div className="flex-1 text-center lg:text-left lg:ml-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-orange mb-4">
              Satoshi Farm
            </h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-2xl">
              "Why do people eat organic foods? Because they believe it's healthier and better for the environment. 
              But what if we could make it even better? What if we could ensure transparency, fair pricing, 
              and direct farmer-to-consumer connections through blockchain technology?"
            </p>
            <p className="text-sm text-accent italic">
              - Inspired by Satoshi's vision of decentralized trust
            </p>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="text-center">
          <p className="text-sm text-accent">
            Pay with STX or USDCx • Built for the paying with USDCx Hermes Challenge
          </p>
          <p className="text-sm text-accent mt-2">
            You can get or bridge their testnet from{" "}
            <a
              href="https://hermes-sage.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Hermes
            </a>{" "}
            for testing
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        inStockOnly={inStockOnly}
        onInStockChange={setInStockOnly}
      />

      {/* Items Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="mt-4 text-muted-foreground">Loading marketplace items...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-destructive">Error loading items. Please try again.</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <Bitcoin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">No items found</p>
          <p className="text-sm text-muted-foreground mt-2">
            {items.length === 0 ? "Be the first to list an item!" : "Try adjusting your search or filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              index={index}
              onBuy={setSelectedItem}
            />
          ))}
        </div>
      )}

      {/* Buy Modal */}
      <BuyModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </Layout>
  );
};

export default Index;
