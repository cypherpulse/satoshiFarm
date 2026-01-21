import { Bitcoin, Coins, Loader2, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { useSellerEarnings, useRefreshMarketplace } from "@/hooks/useMarketplace";
import { formatAmount } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const Earnings = () => {
  const { address, isConnected, withdrawStx, withdrawUsdcx } = useWallet();
  const { data: earnings, isLoading } = useSellerEarnings(address);
  const { refreshEarnings } = useRefreshMarketplace();
  const [withdrawingStx, setWithdrawingStx] = useState(false);
  const [withdrawingUsdcx, setWithdrawingUsdcx] = useState(false);

  const handleWithdrawStx = async () => {
    try {
      setWithdrawingStx(true);
      await withdrawStx();
      toast({ title: "STX withdrawal submitted!", description: "Check your wallet." });
      refreshEarnings();
    } catch (error) {
      toast({ title: "Withdrawal failed", description: String(error), variant: "destructive" });
    } finally {
      setWithdrawingStx(false);
    }
  };

  const handleWithdrawUsdcx = async () => {
    try {
      setWithdrawingUsdcx(true);
      await withdrawUsdcx();
      toast({ title: "USDCx withdrawal submitted!", description: "Check your wallet." });
      refreshEarnings();
    } catch (error) {
      toast({ title: "Withdrawal failed", description: String(error), variant: "destructive" });
    } finally {
      setWithdrawingUsdcx(false);
    }
  };

  if (!isConnected) {
    return (
      <Layout>
        <div className="text-center py-20">
          <Bitcoin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your wallet to view your earnings
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-orange flex items-center justify-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            My Earnings
          </h1>
          <p className="text-muted-foreground mt-2">
            Withdraw your marketplace earnings
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* STX Earnings Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bitcoin className="h-6 w-6 text-primary" />
                  STX Earnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6 rounded-lg bg-secondary">
                  <p className="text-4xl font-bold text-primary">
                    {formatAmount(earnings?.stx || BigInt(0))}
                  </p>
                  <p className="text-muted-foreground mt-1">STX</p>
                </div>
                <Button
                  onClick={handleWithdrawStx}
                  disabled={withdrawingStx || !earnings?.stx || earnings.stx === BigInt(0)}
                  className="w-full bg-primary hover:bg-stacks-orange-hover animate-pulse-glow"
                >
                  {withdrawingStx ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Withdrawing...
                    </>
                  ) : (
                    <>
                      <Coins className="mr-2 h-4 w-4" />
                      Withdraw STX Earnings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* USDCx Earnings Card */}
            <Card className="bg-card border-border border-accent/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
                    $
                  </div>
                  USDCx Earnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6 rounded-lg bg-secondary">
                  <p className="text-4xl font-bold text-accent">
                    {formatAmount(earnings?.usdcx || BigInt(0))}
                  </p>
                  <p className="text-muted-foreground mt-1">USDCx</p>
                </div>
                <Button
                  onClick={handleWithdrawUsdcx}
                  disabled={withdrawingUsdcx || !earnings?.usdcx || earnings.usdcx === BigInt(0)}
                  className="w-full bg-accent hover:bg-accent/80 text-accent-foreground glow-gold"
                >
                  {withdrawingUsdcx ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Withdrawing...
                    </>
                  ) : (
                    <>
                      <Coins className="mr-2 h-4 w-4" />
                      Withdraw USDCx Earnings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Earnings;
