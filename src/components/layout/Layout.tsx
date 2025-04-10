
import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Heart,
  LogIn,
  LogOut,
  Home,
  Store,
  Info,
  Mail,
  ChevronDown,
  Star,
  Package,
  Clock,
  Settings,
  ShoppingCart,
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { items, getItemCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };
  
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
  const menuItems = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-2" /> },
    { name: 'Shop', path: '/shop', icon: <Store className="h-4 w-4 mr-2" /> },
    { name: 'About', path: '/about', icon: <Info className="h-4 w-4 mr-2" /> },
    { name: 'Contact', path: '/contact', icon: <Mail className="h-4 w-4 mr-2" /> },
  ];
  
  const categories = [
    'Dresses',
    'Shirts',
    'Pants',
    'Jackets',
    'Shoes',
    'Accessories',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex items-center gap-2 mb-6">
                  <Link to="/" className="text-xl font-bold text-primary">
                    Tiffah Thrift
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="ml-auto">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>
                
                <nav className="flex flex-col gap-2">
                  {menuItems.map((item) => (
                    <SheetClose key={item.path} asChild>
                      <Link to={item.path}>
                        <Button 
                          variant={isActive(item.path) ? "default" : "ghost"} 
                          className="w-full justify-start"
                        >
                          {item.icon}
                          {item.name}
                        </Button>
                      </Link>
                    </SheetClose>
                  ))}
                  
                  <div className="pt-4 pb-2">
                    <h3 className="text-sm font-medium mb-2 px-3">Categories</h3>
                    {categories.map((category) => (
                      <SheetClose key={category} asChild>
                        <Link to={`/category/${category.toLowerCase()}`}>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-muted-foreground"
                          >
                            <Package className="h-4 w-4 mr-2" />
                            {category}
                          </Button>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </nav>
                
                <div className="mt-auto pt-6 border-t">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getInitials()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <SheetClose asChild>
                        <Link to="/account">
                          <Button variant="outline" className="w-full">
                            <User className="mr-2 h-4 w-4" />
                            My Account
                          </Button>
                        </Link>
                      </SheetClose>
                      <Button 
                        variant="ghost" 
                        className="w-full"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <SheetClose asChild>
                        <Link to="/auth">
                          <Button className="w-full">
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                          </Button>
                        </Link>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="text-xl font-bold text-primary">
              Tiffah Thrift
            </Link>
            
            <nav className="hidden lg:flex items-center gap-2">
              {menuItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={isActive(item.path) ? "default" : "ghost"}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    Categories
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category}
                      onClick={() => navigate(`/category/${category.toLowerCase()}`)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <SheetContent side="top" className="h-auto">
                <form onSubmit={handleSearch} className="py-6">
                  <div className="flex max-w-md mx-auto gap-2">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search for products..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <Button type="submit">Search</Button>
                  </div>
                </form>
              </SheetContent>
            </Sheet>
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {items.length > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                  >
                    {getItemCount()}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/account')}>
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/account?tab=orders')}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/account?tab=wishlist')}>
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  {['productManager', 'orderPreparer', 'deliveryStaff'].includes(user.role) && (
                    <DropdownMenuItem onClick={() => navigate('/staff')}>
                      <Package className="mr-2 h-4 w-4" />
                      Staff Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t bg-muted/40">
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Tiffah Thrift</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sustainable fashion at affordable prices. Quality second-hand clothing for the fashion-conscious shopper.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <i className="fab fa-facebook-f" />
                </Button>
                <Button variant="outline" size="icon">
                  <i className="fab fa-twitter" />
                </Button>
                <Button variant="outline" size="icon">
                  <i className="fab fa-instagram" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-foreground transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="text-muted-foreground hover:text-foreground transition">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-foreground transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-foreground transition">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm">
                {categories.map((category) => (
                  <li key={category}>
                    <Link 
                      to={`/category/${category.toLowerCase()}`}
                      className="text-muted-foreground hover:text-foreground transition"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <address className="text-sm text-muted-foreground not-italic space-y-2">
                <p>123 Fashion Street</p>
                <p>Nairobi, Kenya</p>
                <p>Email: info@tiffahthrift.com</p>
                <p>Phone: +254 712 345 678</p>
              </address>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Tiffah Thrift Store. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/privacy-policy" className="hover:text-foreground transition">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition">
                Terms of Service
              </Link>
              <Link to="/faq" className="hover:text-foreground transition">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
