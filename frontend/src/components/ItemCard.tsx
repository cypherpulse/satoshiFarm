import { Bitcoin, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketplaceItem } from "@/lib/stacks-types";
import { formatAmount, shortenAddress } from "@/lib/constants";

interface ItemCardProps {
  item: MarketplaceItem;
  onBuy: (item: MarketplaceItem) => void;
  index?: number;
}

const ItemCard = ({ item, onBuy, index = 0 }: ItemCardProps) => {
  return (
    <Card 
      className={`overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 animate-fade-in-up opacity-0`}
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
    >
      <div className="aspect-square relative overflow-hidden bg-secondary">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Bitcoin className="h-16 w-16 text-primary/50" />
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-primary">
          {item.quantity} left
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{item.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-[2.5rem]">
          {item.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Bitcoin className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg">{formatAmount(item.price)}</span>
            <span className="text-xs text-muted-foreground">STX/USDCx</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Seller: {shortenAddress(item.seller)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onBuy(item)} 
          className="w-full bg-primary hover:bg-stacks-orange-hover"
          disabled={item.quantity === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {item.quantity > 0 ? "Buy Now" : "Sold Out"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
