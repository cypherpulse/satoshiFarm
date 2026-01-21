import { useState } from "react";
import { Bitcoin, ImageIcon, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWallet } from "@/contexts/WalletContext";
import { useRefreshMarketplace } from "@/hooks/useMarketplace";
import { toMicroUnits } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";

const ListItem = () => {
  const { listItem, isConnected } = useWallet();
  const { refreshItems } = useRefreshMarketplace();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    quantity: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast({ title: "Please connect your wallet first", variant: "destructive" });
      return;
    }

    if (!formData.name || !formData.description || !formData.price || !formData.quantity) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      await listItem({
        name: formData.name.slice(0, 100),
        description: formData.description.slice(0, 200),
        imageUrl: formData.imageUrl.slice(0, 200),
        price: toMicroUnits(parseFloat(formData.price)),
        quantity: parseInt(formData.quantity),
      });
      
      toast({ title: "Item listing submitted!", description: "Check your wallet for confirmation." });
      setFormData({ name: "", description: "", imageUrl: "", price: "", quantity: "" });
      refreshItems();
    } catch (error) {
      toast({ title: "Failed to list item", description: String(error), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-orange flex items-center justify-center gap-2">
            <Bitcoin className="h-8 w-8 text-primary" />
            List Your Item
          </h1>
          <p className="text-muted-foreground mt-2">
            Add your farm produce to the marketplace
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Fresh Organic Tomatoes"
                  maxLength={100}
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">{formData.name.length}/100 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your item..."
                  maxLength={200}
                  className="bg-secondary border-border min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">{formData.description.length}/200 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    maxLength={200}
                    className="bg-secondary border-border"
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden bg-secondary aspect-video">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (STX/USDCx) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.000001"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="10.00"
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="100"
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !isConnected}
                className="w-full bg-primary hover:bg-stacks-orange-hover glow-orange h-12 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Listing Item...
                  </>
                ) : (
                  <>
                    <Bitcoin className="mr-2 h-5 w-5" />
                    List Item on Marketplace
                  </>
                )}
              </Button>

              {!isConnected && (
                <p className="text-center text-sm text-muted-foreground">
                  Please connect your wallet to list items
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ListItem;
