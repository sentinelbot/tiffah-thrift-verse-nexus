
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Heart } from 'lucide-react';

// Mock data for similar products
const mockSimilarProducts: Product[] = [
  {
    id: 'rec-001',
    name: 'Vintage Denim Jacket',
    price: 2500,
    imageUrl: '/placeholder.svg',
    category: 'Jackets',
    condition: 'good',
    barcode: 'BAR001',
    status: 'available',
    size: 'M',
    brand: 'Levi\'s',
    color: 'Blue',
    description: 'Classic vintage denim jacket in excellent condition'
  },
  {
    id: 'rec-002',
    name: 'Floral Summer Dress',
    price: 1800,
    imageUrl: '/placeholder.svg',
    category: 'Dresses',
    condition: 'likeNew',
    barcode: 'BAR002',
    status: 'available',
    size: 'S',
    brand: 'Zara',
    color: 'Multicolor',
    description: 'Beautiful floral summer dress, perfect for sunny days'
  },
  {
    id: 'rec-003',
    name: 'Leather Loafers',
    price: 3200,
    imageUrl: '/placeholder.svg', 
    category: 'Shoes',
    condition: 'good',
    barcode: 'BAR003',
    status: 'available',
    size: '42',
    brand: 'Cole Haan',
    color: 'Brown',
    description: 'Classic leather loafers, minimal wear on soles'
  },
  {
    id: 'rec-004',
    name: 'Cashmere Sweater',
    price: 4500,
    imageUrl: '/placeholder.svg',
    category: 'Knitwear',
    condition: 'likeNew',
    barcode: 'BAR004',
    status: 'available',
    size: 'L',
    brand: 'Uniqlo',
    color: 'Navy',
    description: 'Soft cashmere sweater, perfect for colder weather'
  }
];

// Mock data for "complete the look" products
const mockCompleteTheLookProducts: Product[] = [
  {
    id: 'comp-001',
    name: 'Slim Fit Jeans',
    price: 1900,
    imageUrl: '/placeholder.svg',
    category: 'Pants',
    condition: 'good',
    barcode: 'BAR005',
    status: 'available',
    size: '32',
    brand: 'H&M',
    color: 'Dark Blue',
    description: 'Classic slim fit jeans that pair well with anything'
  },
  {
    id: 'comp-002',
    name: 'Canvas Sneakers',
    price: 1500,
    imageUrl: '/placeholder.svg',
    category: 'Shoes',
    condition: 'good',
    barcode: 'BAR006',
    status: 'available',
    size: '43',
    brand: 'Converse',
    color: 'White',
    description: 'Classic white canvas sneakers'
  }
];

interface AIProductRecommendationsProps {
  productId?: string;
  category?: string;
}

const AIProductRecommendations: React.FC<AIProductRecommendationsProps> = ({ productId, category }) => {
  const { addItem, isInCart, addToWishlist, isInWishlist } = useCart();
  
  const handleAddToCart = (product: Product) => {
    addItem({
      id: `cart-${product.id}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl || '/placeholder.svg'
    });
  };
  
  const handleAddToWishlist = (product: Product) => {
    addToWishlist(product);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Similar Items You Might Like</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockSimilarProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square bg-muted relative">
                <img 
                  src={product.imageUrl || '/placeholder.svg'} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2">
                  {product.condition === 'new' ? 'New' : 
                   product.condition === 'likeNew' ? 'Like New' : 
                   product.condition === 'good' ? 'Good' : 'Fair'}
                </Badge>
              </div>
              <CardContent className="p-3">
                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-bold">KSh {product.price.toLocaleString()}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleAddToWishlist(product)}
                      disabled={isInWishlist(product.id)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart(product.id)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Complete The Look</h3>
        <div className="grid grid-cols-2 gap-4">
          {mockCompleteTheLookProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="flex">
                <div className="w-1/3 bg-muted">
                  <img 
                    src={product.imageUrl || '/placeholder.svg'} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-3">
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <span className="block text-muted-foreground text-xs mt-1">
                    {product.brand} - {product.size}
                  </span>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold">KSh {product.price.toLocaleString()}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart(product.id)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIProductRecommendations;
