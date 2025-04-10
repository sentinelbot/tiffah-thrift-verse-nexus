
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Home,
  Package,
  ShoppingCart,
  Truck,
  Barcode,
  MessageSquare,
  Settings,
  UserCircle,
  LogOut,
  Menu,
  LayoutDashboard,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface StaffLayoutProps {
  children: React.ReactNode;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  // Determine staff role for conditional menu items
  const isProductManager = user?.role === 'productManager';
  const isOrderPreparer = user?.role === 'orderPreparer';
  const isDeliveryStaff = user?.role === 'deliveryStaff';
  const isAdmin = user?.role === 'admin';

  // Define navigation items
  const navItems = [
    {
      name: 'Dashboard',
      path: '/staff/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      visible: true,
    },
    {
      name: 'Products',
      path: '/staff/products',
      icon: <Package className="h-5 w-5" />,
      visible: isProductManager || isAdmin,
    },
    {
      name: 'Orders',
      path: '/staff/orders',
      icon: <ShoppingCart className="h-5 w-5" />,
      visible: isOrderPreparer || isAdmin,
    },
    {
      name: 'Deliveries',
      path: '/staff/deliveries',
      icon: <Truck className="h-5 w-5" />,
      visible: isDeliveryStaff || isAdmin,
    },
    {
      name: 'Barcode Scanner',
      path: '/staff/scanning',
      icon: <Barcode className="h-5 w-5" />,
      visible: true,
    },
    {
      name: 'Communications',
      path: '/staff/communications',
      icon: <MessageSquare className="h-5 w-5" />,
      visible: true,
    },
    {
      name: 'Settings',
      path: '/staff/settings',
      icon: <Settings className="h-5 w-5" />,
      visible: true,
    },
  ];

  const visibleNavItems = navItems.filter(item => item.visible);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 border-r">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-primary">Tiffah Staff Portal</h1>
          </div>
          
          <div className="flex-grow py-4">
            <nav className="space-y-1">
              {visibleNavItems.map((item) => (
                <Button
                  key={item.name}
                  variant={window.location.pathname === item.path ? "secondary" : "ghost"}
                  className="w-full justify-start px-4"
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Button>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/')}>
              <Home className="h-5 w-5" />
              <span className="ml-3">Main Website</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="flex flex-col flex-grow">
        <header className="sticky top-0 z-10 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-full items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="lg:hidden w-64 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                      <h1 className="text-xl font-bold text-primary">Tiffah Staff Portal</h1>
                    </div>
                    
                    <div className="flex-grow py-4">
                      <nav className="space-y-1">
                        {visibleNavItems.map((item) => (
                          <Button
                            key={item.name}
                            variant={window.location.pathname === item.path ? "secondary" : "ghost"}
                            className="w-full justify-start px-4"
                            onClick={() => navigate(item.path)}
                          >
                            {item.icon}
                            <span className="ml-3">{item.name}</span>
                          </Button>
                        ))}
                      </nav>
                    </div>
                    
                    <div className="p-4 border-t">
                      <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/')}>
                        <Home className="h-5 w-5" />
                        <span className="ml-3">Main Website</span>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className="text-lg font-semibold lg:hidden">Tiffah Staff</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.name}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/account')}>
                    <UserCircle className="h-4 w-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/staff/settings')}>
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
