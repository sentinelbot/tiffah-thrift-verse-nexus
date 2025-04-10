
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatDistanceToNow } from "date-fns";

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    calculateCartTotal 
  } = useCart();
  
  // Shipping cost - in a real app, this would be calculated based on location, weight, etc.
  const shippingCost = cartItems.length > 0 ? 5.99 : 0;
  const subtotal = calculateCartTotal();
  const total = subtotal + shippingCost;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Cart</h1>
        <Separator className="mb-6" />
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-sm">Product</th>
                        <th className="px-4 py-3 text-center font-medium text-sm">Quantity</th>
                        <th className="px-4 py-3 text-right font-medium text-sm">Price</th>
                        <th className="px-4 py-3 text-right font-medium text-sm">Total</th>
                        <th className="px-4 py-3 text-right font-medium text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {cartItems.map((item) => {
                        const { product, quantity, reservedUntil } = item;
                        const timeLeft = formatDistanceToNow(reservedUntil, { addSuffix: true });
                        
                        return (
                          <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden border border-border">
                                  <img 
                                    src={product.imageUrl} 
                                    alt={product.title} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <Link 
                                    to={`/product/${product.id}`} 
                                    className="font-medium hover:text-primary transition-colors"
                                  >
                                    {product.title}
                                  </Link>
                                  <div className="text-sm text-muted-foreground">
                                    {product.size && <span>Size: {product.size}</span>}
                                    {product.size && product.condition && <span> • </span>}
                                    {product.condition && <span>Condition: {product.condition}</span>}
                                  </div>
                                  <div className="text-xs flex items-center text-muted-foreground mt-1">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Reserved {timeLeft}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center border rounded-md overflow-hidden w-28 mx-auto">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-none"
                                  onClick={() => updateQuantity(product.id, quantity - 1)}
                                  disabled={quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-10 text-center">{quantity}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-none"
                                  onClick={() => updateQuantity(product.id, quantity + 1)}
                                  disabled={quantity >= 10}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              ${product.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-4 text-right font-medium">
                              ${(product.price * quantity).toFixed(2)}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeFromCart(product.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div>
              <div className="rounded-lg border border-border p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 mb-3" asChild>
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Items in your cart are reserved for 15 minutes.
                </p>
              </div>
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

export default Cart;
