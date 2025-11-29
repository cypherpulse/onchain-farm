import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Leaf } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">OnchainFarm</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#marketplace" className="text-foreground hover:text-primary transition-colors">
              Marketplace
            </a>
            <a href="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </a>
            <ConnectButton 
              chainStatus="icon"
              showBalance={false}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
