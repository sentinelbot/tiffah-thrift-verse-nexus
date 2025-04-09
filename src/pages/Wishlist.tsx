
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";

const Wishlist = () => {
  // Empty wishlist state for now
  const wishlistItems: any[] = [];
  
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
          <div>
            {/* Wishlist items would go here */}
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
