
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Menu,
  Search,
  User,
  ShoppingCart,
  Heart,
  LogOut,
  Settings,
  Package,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  // Get first letter of user's name for avatar
  const getNameInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Determine if user has admin access
  const hasAdminAccess = user && ['admin', 'superadmin'].includes(user.role);

  return (
    <nav className="border-b bg-background">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                  <h2 className="mb-2 text-lg font-semibold">Menu</h2>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/">Home</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/shop">Shop</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/new-arrivals">New Arrivals</Link>
                    </Button>
                    {hasAdminAccess && (
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/admin">Admin Dashboard</Link>
                      </Button>
                    )}
                    {user?.role === 'productManager' && (
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/staff/product-manager">Product Manager</Link>
                      </Button>
                    )}
                    {user?.role === 'orderPreparer' && (
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/staff/order-preparer">Order Preparer</Link>
                      </Button>
                    )}
                    {user?.role === 'deliveryStaff' && (
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/staff/delivery-staff">Delivery Staff</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-primary">Tiffah</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" asChild>
              <Link to="/shop">Shop</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/new-arrivals">New Arrivals</Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  0
                </Badge>
              </div>
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback>{getNameInitial()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user.name || user.email}
                  <p className="text-sm font-normal text-muted-foreground capitalize">
                    {user.role}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/orders" className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                {hasAdminAccess && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === 'productManager' && (
                  <DropdownMenuItem asChild>
                    <Link to="/staff/product-manager" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Product Management
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === 'orderPreparer' && (
                  <DropdownMenuItem asChild>
                    <Link to="/staff/order-preparer" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Order Preparation
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === 'deliveryStaff' && (
                  <DropdownMenuItem asChild>
                    <Link to="/staff/delivery-staff" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Delivery Management
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">
                <User className="h-5 w-5 mr-2" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>

      {isSearchOpen && (
        <div className="p-4 border-t">
          <div className="max-w-xl mx-auto">
            <Input
              placeholder="Search for products..."
              className="w-full"
              autoFocus
              onBlur={() => setIsSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
