
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ProductType } from '@/types/product';

interface ProductCardProps {
  product: ProductType;
  onAddToCart?: (product: ProductType) => void;
  onAddToWishlist?: (product: ProductType) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart,
  onAddToWishlist 
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md border border-border"
      onClick={handleClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/50">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name || product.title || 'Product image'} 
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
            No Image
          </div>
        )}
        
        {product.originalPrice && product.originalPrice > product.price && (
          <Badge className="absolute top-2 left-2 bg-primary text-white">
            Sale
          </Badge>
        )}
        
        {product.condition && (
          <Badge className="absolute top-2 right-2" variant="outline">
            {product.condition}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium line-clamp-1">
          {product.name || product.title}
        </h3>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-primary">
            KSh {product.price.toLocaleString()}
          </span>
          
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              KSh {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        
        {(product.size || product.color || product.brand) && (
          <div className="flex flex-wrap gap-x-2 mt-2 text-xs text-muted-foreground">
            {product.brand && <span>{product.brand}</span>}
            {product.size && <span>Size: {product.size}</span>}
            {product.color && <span>Color: {product.color}</span>}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-2 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleAddToWishlist}
        >
          <Heart className="h-4 w-4 mr-1" />
          Wishlist
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
