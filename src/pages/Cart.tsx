
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";

const Cart = () => {
  // Empty cart state for now
  const cartItems: any[] = [];
  
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
          <div>
            {/* Cart items would go here */}
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
