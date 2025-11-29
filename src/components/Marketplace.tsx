import ProductCard from './ProductCard';

const products = [
  {
    name: 'Organic Tomatoes',
    price: '0.025',
    farmer: 'Green Valley Farm',
    location: 'California, USA',
    image: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=800&q=80',
    category: 'Vegetables',
  },
  {
    name: 'Fresh Honey',
    price: '0.045',
    farmer: 'Bee Happy Apiary',
    location: 'Vermont, USA',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=800&q=80',
    category: 'Honey',
  },
  {
    name: 'Organic Apples',
    price: '0.03',
    farmer: 'Sunny Orchards',
    location: 'Washington, USA',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80',
    category: 'Fruits',
  },
  {
    name: 'Free-Range Eggs',
    price: '0.02',
    farmer: 'Happy Hens Farm',
    location: 'Oregon, USA',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&q=80',
    category: 'Dairy',
  },
  {
    name: 'Organic Carrots',
    price: '0.018',
    farmer: 'Earth Roots Farm',
    location: 'Colorado, USA',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80',
    category: 'Vegetables',
  },
  {
    name: 'Fresh Strawberries',
    price: '0.035',
    farmer: 'Berry Fields Forever',
    location: 'Florida, USA',
    image: 'https://images.unsplash.com/photo-1543528176-61b239494933?w=800&q=80',
    category: 'Fruits',
  },
];

const Marketplace = () => {
  return (
    <section id="marketplace" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Fresh from the Farm
          </h2>
          <p className="text-xl text-muted-foreground">
            Browse our selection of premium organic products
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marketplace;
