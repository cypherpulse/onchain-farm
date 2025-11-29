import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';

// Mock data - will be replaced with blockchain data
const mockProducts = [
  {
    id: 1,
    name: 'Organic Tomatoes',
    price: '0.025',
    category: 'Vegetables',
    quantity: 50,
    sold: 12,
    image: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=400&q=80',
  },
  {
    id: 2,
    name: 'Fresh Honey',
    price: '0.045',
    category: 'Honey',
    quantity: 30,
    sold: 8,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=400&q=80',
  },
];

const MyProducts = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Your Listed Products</h2>
        <Badge variant="outline" className="text-base">
          {mockProducts.length} Products
        </Badge>
      </div>

      {mockProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No products listed yet. Start by listing your first product!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {mockProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="grid md:grid-cols-[200px_1fr_auto] gap-6 p-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <Badge>{product.category}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-lg font-semibold text-primary">
                        {product.price} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available</p>
                      <p className="text-lg font-semibold text-foreground">
                        {product.quantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sold</p>
                      <p className="text-lg font-semibold text-foreground">
                        {product.sold}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 justify-center">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
