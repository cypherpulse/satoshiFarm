import { useState } from "react";
import { Bitcoin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MarketplaceItem } from "@/lib/stacks-types";
import { formatAmount } from "@/lib/constants";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "@/hooks/use-toast";

interface BuyModalProps {
  item: MarketplaceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const BuyModal = ({ item, isOpen, onClose }: BuyModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [useUsdcx, setUseUsdcx] = useState(true); // Default to USDCx
  const [isLoading, setIsLoading] = useState(false);
  const { buyItem, isConnected } = useWallet();

  if (!item) return null;

  // Use same price for both currencies (from blockchain data)
  const totalPrice = Number(item.price) * quantity;

  const handleBuy = async () => {
    if (!isConnected) {
      toast({ title: "Please connect your wallet first", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      await buyItem({
        itemId: item.id,
        quantity,
        useStx: !useUsdcx,
      });
      toast({ title: "Transaction submitted!", description: "Check your wallet for confirmation." });
      onClose();
    } catch (error) {
      toast({ title: "Transaction failed", description: String(error), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bitcoin className="h-5 w-5 text-primary" />
            Buy {item.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (max: {item.quantity})</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={item.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(Number(e.target.value), item.quantity))}
              className="bg-secondary border-border"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Pay with STX</span>
            </div>
            <Switch
              checked={useUsdcx}
              onCheckedChange={setUseUsdcx}
              className={useUsdcx ? "data-[state=checked]:bg-accent glow-gold" : ""}
            />
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${useUsdcx ? "text-accent" : "text-muted-foreground"}`}>
                Pay with USDCx
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-secondary border border-border">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total:</span>
              <div className="flex items-center gap-2">
                <Bitcoin className="h-4 w-4 text-primary" />
                <span className="font-bold text-xl">{formatAmount(totalPrice)}</span>
                <span className={useUsdcx ? "text-accent" : "text-primary"}>
                  {useUsdcx ? "USDCx" : "STX"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleBuy}
            disabled={isLoading || !isConnected}
            className="bg-primary hover:bg-stacks-orange-hover glow-orange"
          >
            {isLoading ? "Processing..." : "Confirm Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyModal;
