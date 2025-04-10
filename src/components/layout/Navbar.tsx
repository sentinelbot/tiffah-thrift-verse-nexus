
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Heart, 
  LogOut, 
  LogIn,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Mock cart item count - would come from a cart context in a real app
  const cartItemCount = 3;
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully signed out");
      navigate('/');
    } catch (error) {
      toast.error("Failed to sign out");
      console.error(error);
    }
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              Tiffah<span className="text-muted-foreground">Thrift</span>
            </Link>
          </div>
          
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/shop" className="text-foreground hover:text-primary px-3 py-2 rounded-md">
              Shop
            </Link>
            <Link to="/category/new-arrivals" className="text-foreground hover:text-primary px-3 py-2 rounded-md">
              New Arrivals
            </Link>
            <Link to="/category/sale" className="text-foreground hover:text-primary px-3 py-2 rounded-md">
              Sale
            </Link>
            <Link to="/help" className="text-foreground hover:text-primary px-3 py-2 rounded-md">
              Help
            </Link>
          </div>
          
          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative text-foreground hover:text-primary p-2">
              <ShoppingBag size={24} />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-primary h-5 w-5 flex items-center justify-center p-0">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
            
            {/* Admin link for quick access */}
            <Link to="/admin/auth" className="hidden md:flex text-foreground hover:text-primary p-2">
              <ShieldCheck size={24} />
            </Link>
            
            {/* User dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User size={24} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate('/account')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/wishlist')}>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Wishlist</span>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem onSelect={() => navigate('/admin')}>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => navigate('/auth')}>
                <LogIn size={24} />
              </Button>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
            <Link 
              to="/shop" 
              className="block px-3 py-2 rounded-md text-foreground hover:text-primary"
              onClick={toggleMenu}
            >
              Shop
            </Link>
            <Link 
              to="/category/new-arrivals" 
              className="block px-3 py-2 rounded-md text-foreground hover:text-primary"
              onClick={toggleMenu}
            >
              New Arrivals
            </Link>
            <Link 
              to="/category/sale" 
              className="block px-3 py-2 rounded-md text-foreground hover:text-primary"
              onClick={toggleMenu}
            >
              Sale
            </Link>
            <Link 
              to="/help" 
              className="block px-3 py-2 rounded-md text-foreground hover:text-primary"
              onClick={toggleMenu}
            >
              Help
            </Link>
            <Link 
              to="/admin/auth" 
              className="block px-3 py-2 rounded-md text-foreground hover:text-primary"
              onClick={toggleMenu}
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
