import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart, ShoppingBag, UserCircle2, LogOut, LayoutDashboard, FolderClosed } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EnhancedSearch from "../shop/EnhancedSearch";
import NotificationCenter from '../notifications/NotificationCenter';
import { useMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = cart?.items?.length || 0;
  const isMobile = useMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-2xl text-primary">Tiffah</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/shop" className="hover:text-primary">
              Shop
            </Link>
            <Link to="/new-arrivals" className="hover:text-primary">
              New Arrivals
            </Link>
            <Link to="/category/dresses" className="hover:text-primary">
              Dresses
            </Link>
            <Link to="/category/shirts" className="hover:text-primary">
              Shirts
            </Link>
            <Link to="/category/jeans" className="hover:text-primary">
              Jeans
            </Link>
            <Link to="/category/shoes" className="hover:text-primary">
              Shoes
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <EnhancedSearch 
              onSearch={(query, enhancedResults) => {
                if (!query) return;
                navigate(`/shop?q=${encodeURIComponent(query)}`);
              }}
            />
            <Link to="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center translate-x-1/4 -translate-y-1/4">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            
            {user && <NotificationCenter />}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserCircle2 className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name || 'User'}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account">
                      <UserCircle2 className="mr-2 h-4 w-4" />
                      <span>Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account?tab=orders">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  {/* Admin links for admin users */}
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
            )}
            
            {isMobile ? (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                    <span className="font-bold text-2xl text-primary">Tiffah</span>
                  </Link>
                  <div className="mt-8 space-y-4">
                    <Link to="/shop" className="hover:text-primary block" onClick={() => setIsMenuOpen(false)}>
                      Shop
                    </Link>
                    <Link to="/new-arrivals" className="hover:text-primary block" onClick={() => setIsMenuOpen(false)}>
                      New Arrivals
                    </Link>
                    <Link to="/category/dresses" className="hover:text-primary block" onClick={() => setIsMenuOpen(false)}>
                      Dresses
                    </Link>
                    <Link to="/category/shirts" className="hover:text-primary block" onClick={() => setIsMenuOpen(false)}>
                      Shirts
                    </Link>
                    <Link to="/category/jeans" className="hover:text-primary block" onClick={() => setIsMenuOpen(false)}>
                      Jeans
                    </Link>
                    <Link to="/category/shoes" className="hover:text-primary block" onClick={() => setIsMenuOpen(false)}>
                      Shoes
                    </Link>
                    {user ? (
                      <>
                        <Link to="/account" className="hover:text-primary block" onClick={() => setIsMenuOpen(false)}>
                          Account
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" className="hover:text-primary block" onClick={() => setIsMenuOpen(false)}>
                            Admin
                          </Link>
                        )}
                        <Button variant="link" size="sm" className="block p-0" onClick={handleSignOut}>
                          Sign out
                        </Button>
                      </>
                    ) : (
                      <Link to="/auth" className="hover:text-primary block" onClick={() => setIsMenuOpen(false)}>
                        Sign in
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
