
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ProductType } from '@/types';
import { toast } from 'sonner';

interface ProductCardActionsProps {
  product: ProductType;
}

const ProductCardActions: React.FC<ProductCardActionsProps> = ({ product }) => {
  const { addToCart, addToWishlist } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
    toast.success(`${product.name} added to wishlist`);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        size="sm" 
        onClick={handleAddToCart}
        className="flex-1"
      >
        <ShoppingBag className="h-4 w-4 mr-1" />
        Add to Cart
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={handleAddToWishlist}
        className="p-2"
      >
        <Heart className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductCardActions;
