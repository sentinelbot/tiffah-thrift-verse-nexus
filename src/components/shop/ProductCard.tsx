
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  size?: string;
  brand?: string;
  condition?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  category,
  size,
  brand,
  condition
}) => {
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart();
  
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    addItem({
      id: `cart-${id}-${Date.now()}`,
      productId: id,
      name,
      price,
      quantity: 1,
      image: imageUrl,
      size,
    });
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`${name} added to your wishlist!`);
  };

  return (
    <Card className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-md">
      <div 
        className="relative aspect-square bg-muted overflow-hidden"
        onClick={() => navigate(`/product/${id}`)}
      >
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {originalPrice && (
          <Badge className="absolute top-2 left-2 bg-primary">
            {discountPercentage}% OFF
          </Badge>
        )}
        
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background"
          onClick={handleAddToWishlist}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium line-clamp-1" onClick={() => navigate(`/product/${id}`)}>{name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{category}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">KSh {price}</p>
            {originalPrice && (
              <p className="text-sm text-muted-foreground line-through">KSh {originalPrice}</p>
            )}
          </div>
        </div>
        
        <Button 
          variant={isInCart(id) ? "secondary" : "default"}
          className="w-full mt-2"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {isInCart(id) ? 'Add Again' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
