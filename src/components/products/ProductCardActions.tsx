
import React from "react";
import { Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { toast } from "sonner";
import { ProductType } from "./ProductCard";

interface ProductCardActionsProps {
  product: Product | ProductType;
}

const ProductCardActions = ({ product }: ProductCardActionsProps) => {
  const { addToCart, addToWishlist } = useCart();
  
  const handleAddToCart = () => {
    // Convert to a format that works with both Product and ProductType
    const cartProduct = {
      id: product.id,
      name: 'name' in product ? product.name : product.title,
      price: product.price,
      imageUrl: 'imageUrl' in product ? 
        product.imageUrl : 
        (('images' in product && product.images && product.images.length > 0) ? 
          product.images[0].url : 
          '/placeholder.svg'),
      size: product.size
    };
    
    addToCart(cartProduct, 1);
    toast.success(`${cartProduct.name} added to cart`);
  };
  
  const handleAddToWishlist = () => {
    // Convert to a format that works with both Product and ProductType
    const wishlistProduct = {
      id: product.id,
      name: 'name' in product ? product.name : product.title,
      price: product.price,
      imageUrl: 'imageUrl' in product ? 
        product.imageUrl : 
        (('images' in product && product.images && product.images.length > 0) ? 
          product.images[0].url : 
          '/placeholder.svg'),
      size: product.size
    };
    
    addToWishlist(wishlistProduct);
    toast.success(`${wishlistProduct.name} added to wishlist`);
  };
  
  return (
    <div className="flex gap-2">
      <Button 
        onClick={handleAddToCart}
        className="flex-1"
        size="sm"
      >
        <Plus className="mr-1 h-4 w-4" />
        Add to Cart
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8"
        onClick={handleAddToWishlist}
      >
        <Heart className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductCardActions;
