
import { ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ProductType } from "./ProductCard";
import { useState } from "react";

interface ProductCardActionsProps {
  product: ProductType;
}

export default function ProductCardActions({ product }: ProductCardActionsProps) {
  const { addToCart, addToWishlist, isInCart, isInWishlist } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    // Simulate a small delay for visual feedback
    setTimeout(() => {
      addToCart(product, 1);
      setIsAddingToCart(false);
    }, 300);
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };
  
  return (
    <div className="flex gap-2">
      <Button
        onClick={handleAddToCart}
        disabled={isInCart(product.id) || isAddingToCart}
        className="w-full text-xs"
        size="sm"
      >
        <ShoppingBag className="h-3.5 w-3.5 mr-1" />
        {isInCart(product.id) ? "In cart" : "Add to cart"}
      </Button>
      
      <Button
        onClick={handleAddToWishlist}
        disabled={isInWishlist(product.id)}
        variant={isInWishlist(product.id) ? "default" : "outline"}
        size="icon"
        className="w-9 h-9 flex-shrink-0"
      >
        <Heart className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
