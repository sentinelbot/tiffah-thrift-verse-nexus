
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu } from "lucide-react";
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

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border py-3 px-4 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          {isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link to="/category/clothing">Clothing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/category/accessories">Accessories</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/category/home">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/category/vintage">Vintage</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/category/new-arrivals">New Arrivals</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Link to="/" className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-thrift-700">
              Tiffah<span className="text-sage-500">Thrift</span>
            </h1>
          </Link>
          
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-4">
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
              <Link to="/category/new-arrivals" className="text-sm hover:text-primary transition-colors">
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
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" asChild>
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart">
              <ShoppingBag className="h-5 w-5" />
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" asChild>
            <Link to="/account">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
