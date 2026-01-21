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
          <p>ToshiFarm – Built for Programming USDCx on Stacks Builder Challenge</p>
          <p className="mt-1">Powered by Stacks Testnet • STX & USDCx Payments</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
