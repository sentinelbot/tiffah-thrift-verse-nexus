
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock wishlist data - in a real app, this would come from a context or API
const mockWishlistItems = [
  {
    id: '1',
    name: 'Vintage Leather Jacket',
    price: 3500,
    originalPrice: 4500,
    image: 'https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=150&auto=format&fit=crop',
    category: 'Clothing',
    available: true
  },
  {
    id: '2',
    name: 'Boho Style Maxi Dress',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=150&auto=format&fit=crop',
    category: 'Clothing',
    available: true
  },
  {
    id: '3',
    name: 'Vintage Platform Boots',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=150&auto=format&fit=crop',
    category: 'Shoes',
    available: false
  },
];

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = React.useState(mockWishlistItems);
  
  const removeItem = (id: string) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
    toast("Item removed from wishlist");
  };
  
  const addToCart = (id: string) => {
    toast("Item added to cart");
    // In a real app, you would add to cart here and possibly remove from wishlist
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save items you love to your wishlist. Review them anytime and easily move them to your cart.
            </p>
            <Button asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-square bg-muted relative">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute top-2 right-2 text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  {!item.available && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Badge variant="outline" className="bg-background text-foreground">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <div className="font-medium">KSh {item.price.toLocaleString()}</div>
                      {item.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          KSh {item.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                  
                  <Button 
                    className="w-full mt-4"
                    disabled={!item.available}
                    onClick={() => addToCart(item.id)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
