import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { ProductType } from "@/types";

const Wishlist = () => {
  const { addToCart, wishlist, removeFromWishlist } = useCart();
  const [wishlistItems, setWishlistItems] = useState<ProductType[]>([]);
  
  useEffect(() => {
    const formattedItems = wishlist.map(item => ({
      id: item.id,
      title: item.name || item.title || '',
      price: item.price,
      originalPrice: item.originalPrice,
      category: item.category,
      condition: item.condition,
      size: item.size,
      imageUrl: item.imageUrl || ''
    }));
    
    setWishlistItems(formattedItems);
  }, [wishlist]);
  
  const moveToCart = (productId: string) => {
    const product = wishlistItems.find(item => item.id === productId);
    if (product) {
      const cartItem = {
        id: product.id,
        name: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
        size: product.size
      };
      
      addToCart(cartItem, 1);
      removeFromWishlist(productId);
    }
  };
  
  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Wishlist</h1>
        <Separator className="mb-6" />
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save items you love to your wishlist. Review them anytime and easily move them to your cart.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <div 
                  key={product.id} 
                  className="border border-border rounded-lg overflow-hidden group hover:border-primary transition-colors"
                >
                  <Link to={`/product/${product.id}`} className="block relative">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title} 
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform"
                    />
                    {product.originalPrice && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </Link>
                  <div className="p-4">
                    <Link 
                      to={`/product/${product.id}`}
                      className="block font-medium mb-1 hover:text-primary transition-colors"
                    >
                      {product.title}
                    </Link>
                    <div className="flex justify-between items-baseline mb-3">
                      <div>
                        <span className="font-semibold text-primary">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through ml-2">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {product.size && `Size ${product.size}`}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 gap-1" 
                        onClick={() => moveToCart(product.id)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Move to Cart
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/shop">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
