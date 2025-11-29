import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface ProductCardProps {
  name: string;
  price: string;
  farmer: string;
  location: string;
  image: string;
  category: string;
}

const ProductCard = ({ name, price, farmer, location, image, category }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg">
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
          {category}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold text-foreground mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-1">by {farmer}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
        <p className="text-2xl font-bold text-primary">{price} ETH</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-primary hover:bg-primary-dark text-primary-foreground"
          size="lg"
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
