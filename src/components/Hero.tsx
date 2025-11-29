import { Button } from '@/components/ui/button';
import { Sprout, ShieldCheck, Coins } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-primary/5 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Farm Fresh,{' '}
              <span className="text-primary">Blockchain</span> Verified
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect directly with farmers. Buy authentic products onchain. 
              Support sustainable agriculture with transparency.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <ConnectButton.Custom>
                {({ account, chain, openConnectModal, mounted }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  return (
                    <Button 
                      size="lg"
                      onClick={openConnectModal}
                      disabled={!ready}
                      className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                    >
                      {connected ? 'Explore Marketplace' : 'Connect Wallet'}
                    </Button>
                  );
                }}
              </ConnectButton.Custom>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Organic</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Fair Trade</span>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right duration-700">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 backdrop-blur-sm border border-primary/20">
              <img 
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80"
                alt="Fresh farm produce"
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
