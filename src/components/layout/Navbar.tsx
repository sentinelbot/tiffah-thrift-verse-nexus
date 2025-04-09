
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border py-3 px-4 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="touch-target" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
          
          <Link to="/" className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold">
              <span className="text-gradient">Tiffah</span>
              <span className="text-foreground">Thrift</span>
            </h1>
          </Link>
          
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/shop" className="text-sm hover:text-primary transition-colors">
                Shop All
              </Link>
              <Link to="/category/clothing" className="text-sm hover:text-primary transition-colors">
                Clothing
              </Link>
              <Link to="/category/accessories" className="text-sm hover:text-primary transition-colors">
                Accessories
              </Link>
              <Link to="/category/home" className="text-sm hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/category/vintage" className="text-sm hover:text-primary transition-colors">
                Vintage
              </Link>
              <Link to="/new-arrivals" className="text-sm hover:text-primary transition-colors">
                New Arrivals
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div
            className={cn(
              "transition-all duration-300 overflow-hidden",
              isSearchOpen 
                ? "w-full md:w-64 opacity-100" 
                : "w-0 opacity-0"
            )}
          >
            <Input
              type="search"
              placeholder="Search products..."
              className="h-9 w-full"
            />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="touch-target"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="touch-target" asChild>
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" className="touch-target relative" asChild>
            <Link to="/cart">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="touch-target">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="w-full">My Account</Link>
                  </DropdownMenuItem>
                  
                  {/* Show admin link for staff roles */}
                  {user.role !== 'customer' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link to="/auth" className="w-full">Sign In / Register</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border py-4 px-6 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/shop" 
              className="text-sm hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop All
            </Link>
            <Link 
              to="/category/clothing" 
              className="text-sm hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Clothing
            </Link>
            <Link 
              to="/category/accessories" 
              className="text-sm hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accessories
            </Link>
            <Link 
              to="/category/home" 
              className="text-sm hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/category/vintage" 
              className="text-sm hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Vintage
            </Link>
            <Link 
              to="/new-arrivals" 
              className="text-sm hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              New Arrivals
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
