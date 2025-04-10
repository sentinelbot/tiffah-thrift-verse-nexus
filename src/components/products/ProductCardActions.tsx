
import React from "react";
import { Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ProductType } from "@/types";
import { toast } from "sonner";

interface ProductCardActionsProps {
  product: ProductType;
}

const ProductCardActions = ({ product }: ProductCardActionsProps) => {
  const { addToCart, addToWishlist } = useCart();
  
  const handleAddToCart = () => {
    // Convert from ProductCard.ProductType to CartContext.ProductType
    addToCart(product, 1);
    toast.success(`${product.title} added to cart`);
  };
  
  const handleAddToWishlist = () => {
    addToWishlist(product);
    toast.success(`${product.title} added to wishlist`);
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
