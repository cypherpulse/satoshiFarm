import { Bitcoin, History as HistoryIcon, ShoppingCart, Tag, Coins } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/contexts/WalletContext";
import { formatAmount } from "@/lib/constants";

const History = () => {
  const { transactions, isConnected } = useWallet();

  const purchases = transactions.filter((tx) => tx.type === "purchase");
  const listings = transactions.filter((tx) => tx.type === "listing");
  const withdrawals = transactions.filter((tx) => tx.type === "withdrawal");

  if (!isConnected) {
    return (
      <Layout>
        <div className="text-center py-20">
          <Bitcoin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your wallet to view transaction history
          </p>
        </div>
      </Layout>
    );
  }

  const TransactionList = ({ items, emptyMessage }: { items: typeof transactions; emptyMessage: string }) => (
    items.length === 0 ? (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    ) : (
      <div className="space-y-4">
        {items.map((tx) => (
          <Card key={tx.id} className="bg-secondary border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {tx.type === "purchase" && <ShoppingCart className="h-5 w-5 text-primary" />}
                  {tx.type === "listing" && <Tag className="h-5 w-5 text-accent" />}
                  {tx.type === "withdrawal" && <Coins className="h-5 w-5 text-success" />}
                  <div>
                    <p className="font-medium">
                      {tx.type === "purchase" && `Bought ${tx.itemName}`}
                      {tx.type === "listing" && `Listed ${tx.itemName}`}
                      {tx.type === "withdrawal" && `Withdrew ${tx.paymentMethod}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tx.timestamp.toLocaleDateString()} at {tx.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatAmount(tx.amount)} {tx.paymentMethod}</p>
                  <Badge
                    variant={tx.status === "success" ? "default" : tx.status === "pending" ? "secondary" : "destructive"}
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-orange flex items-center justify-center gap-2">
            <HistoryIcon className="h-8 w-8 text-primary" />
            Transaction History
          </h1>
          <p className="text-muted-foreground mt-2">
            View your marketplace activity
          </p>
        </div>

        <Tabs defaultValue="purchases" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger value="purchases">Purchases ({purchases.length})</TabsTrigger>
            <TabsTrigger value="listings">Listings ({listings.length})</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals ({withdrawals.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="purchases" className="mt-6">
            <TransactionList items={purchases} emptyMessage="No purchases yet" />
          </TabsContent>
          <TabsContent value="listings" className="mt-6">
            <TransactionList items={listings} emptyMessage="No listings yet" />
          </TabsContent>
          <TabsContent value="withdrawals" className="mt-6">
            <TransactionList items={withdrawals} emptyMessage="No withdrawals yet" />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default History;
