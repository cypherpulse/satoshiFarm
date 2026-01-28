import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built for Programming USDCx{" "}
            <a
              href="https://hermes-sage.vercel.app/transfer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              on Hermes
            </a>
          </p>
          <p className="mt-1">Powered by Stacks Testnet • STX & USDCx Payments</p>
          <p className="mt-1">
            Contract:{" "}
            <a
              href="https://explorer.hiro.so/txid/STGDS0Y17973EN5TCHNHGJJ9B31XWQ5YXBQ0KQ2Y.toshi-farm-v2?chain=testnet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View on Hiro Explorer
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
