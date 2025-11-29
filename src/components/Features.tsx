import { Shield, Truck, Leaf, Users } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Blockchain Verified',
    description: 'Every product is tracked on-chain, ensuring authenticity and transparency from farm to table.',
  },
  {
    icon: Truck,
    title: 'Direct Trading',
    description: 'Connect directly with farmers, eliminating middlemen and ensuring fair prices for both parties.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Practices',
    description: 'Support eco-friendly farming methods and contribute to a more sustainable food system.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Join a growing community of conscious consumers and dedicated farmers building the future of agriculture.',
  },
];

const Features = () => {
  return (
    <section id="about" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Why Choose OnchainFarm?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Revolutionizing agriculture through blockchain technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-2xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg group"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
