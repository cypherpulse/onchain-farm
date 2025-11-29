import { Card, CardContent } from '@/components/ui/card';
import { Package, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

const stats = [
  {
    title: 'Total Products',
    value: '2',
    icon: Package,
    description: 'Active listings',
  },
  {
    title: 'Total Sales',
    value: '0.52 ETH',
    icon: DollarSign,
    description: '+12.5% from last month',
  },
  {
    title: 'Orders',
    value: '20',
    icon: ShoppingCart,
    description: '8 pending delivery',
  },
  {
    title: 'Success Rate',
    value: '98%',
    icon: TrendingUp,
    description: 'Customer satisfaction',
  },
];

const DashboardStats = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {stat.value}
              </span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {stat.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
