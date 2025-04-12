
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, HeartIcon } from 'lucide-react';
import { toast } from 'sonner';

// Mock cart data - in a real app, this would come from a cart context or API
const mockCartItems = [
  {
    id: '1',
    name: 'Vintage Denim Jacket',
    price: 2500,
    originalPrice: 3500,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=150&auto=format&fit=crop',
    size: 'M',
    color: 'Blue'
  },
  {
    id: '2',
    name: 'Floral Summer Dress',
    price: 1800,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=150&auto=format&fit=crop',
    size: 'S',
    color: 'Multi'
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = React.useState(mockCartItems);
  const [promoCode, setPromoCode] = React.useState('');
  
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 200; // Free shipping over KSh 5,000
  const total = subtotal + shipping;
  
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast("Item removed from cart");
  };
  
  const moveToWishlist = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast("Item moved to wishlist");
  };
  
  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      toast("Please enter a promo code", {
        description: "Enter a valid promo code to receive a discount"
      });
      return;
    }
    
    // Mock promo code validation
    if (promoCode.toLowerCase() === 'welcome10') {
      toast("Promo code applied!", {
        description: "You've received a 10% discount"
      });
    } else {
      toast("Invalid promo code", {
        description: "The promo code you entered is not valid"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-32 h-32 bg-muted">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <div className="text-sm text-muted-foreground mt-1">
                              Size: {item.size} • Color: {item.color}
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0 text-right">
                            <div className="font-medium">KSh {item.price.toLocaleString()}</div>
                            {item.originalPrice && (
                              <div className="text-sm text-muted-foreground line-through">
                                KSh {item.originalPrice.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center border rounded-md">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="w-8 text-center">{item.quantity}</div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => moveToWishlist(item.id)}
                            >
                              <HeartIcon className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Save for Later</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Remove</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Order Summary */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>KSh {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping > 0 ? `KSh ${shipping.toLocaleString()}` : 'Free'}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between text-lg font-semibold mb-6">
                    <span>Total</span>
                    <span>KSh {total.toLocaleString()}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Promo code" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button 
                        variant="outline" 
                        onClick={applyPromoCode}
                        className="whitespace-nowrap"
                      >
                        Apply
                      </Button>
                    </div>
                    
                    <Button className="w-full" asChild>
                      <Link to="/checkout">
                        Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/shop">Continue Shopping</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
