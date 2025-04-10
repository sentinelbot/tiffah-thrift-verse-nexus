
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
  
  // Type guard function to check for Product vs ProductType
  const isProduct = (p: ProductType | Product): p is Product => {
    return 'barcode' in p;
  };
  
  const handleAddToCart = () => {
    // Access name and title safely using our type guard
    const productName = isProduct(product) ? product.name : product.name;
    const productTitle = isProduct(product) ? product.title : product.title;
    
    // Convert to a format that works with both Product and ProductType
    const cartProduct: Product = {
      id: product.id,
      name: productName,
      title: productTitle, 
      price: product.price,
      category: product.category,
      condition: product.condition as 'new' | 'likeNew' | 'good' | 'fair',
      barcode: isProduct(product) ? product.barcode : product.id, // Use ID as fallback barcode
      status: 'available',
      dateAdded: new Date(),
      lastUpdated: new Date(),
      featured: false,
      imageUrl: isProduct(product) && product.images && product.images.length > 0
        ? product.images[0].url
        : 'imageUrl' in product ? product.imageUrl : '/placeholder.svg',
      size: product.size
    };
    
    addToCart(cartProduct, 1);
    toast.success(`${productName} added to cart`);
  };
  
  const handleAddToWishlist = () => {
    // Access name and title safely using our type guard
    const productName = isProduct(product) ? product.name : product.name;
    const productTitle = isProduct(product) ? product.title : product.title;
    
    // Convert to a format that works with both Product and ProductType
    const wishlistProduct: Product = {
      id: product.id,
      name: productName,
      title: productTitle,
      price: product.price,
      category: product.category,
      condition: product.condition as 'new' | 'likeNew' | 'good' | 'fair',
      barcode: isProduct(product) ? product.barcode : product.id, // Use ID as fallback barcode
      status: 'available',
      dateAdded: new Date(),
      lastUpdated: new Date(),
      featured: false,
      imageUrl: isProduct(product) && product.images && product.images.length > 0
        ? product.images[0].url
        : 'imageUrl' in product ? product.imageUrl : '/placeholder.svg',
      size: product.size
    };
    
    addToWishlist(wishlistProduct);
    toast.success(`${productName} added to wishlist`);
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
