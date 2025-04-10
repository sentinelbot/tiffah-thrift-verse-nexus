
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
  Users,
  ShoppingCart,
  Package,
  Truck,
  BarChart2,
  Settings,
  UserCircle,
  LogOut,
  Menu,
  LayoutDashboard,
  Megaphone,
  Store,
  Boxes,
  Barcode,
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/admin/auth');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  // Define navigation items
  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'User Management',
      path: '/admin/user-management',
      icon: <UserCircle className="h-5 w-5" />,
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: 'Deliveries',
      path: '/admin/deliveries',
      icon: <Truck className="h-5 w-5" />,
    },
    {
      name: 'Inventory',
      path: '/admin/inventory',
      icon: <Boxes className="h-5 w-5" />,
    },
    {
      name: 'Scanning',
      path: '/admin/scanning',
      icon: <Barcode className="h-5 w-5" />,
    },
    {
      name: 'Reports',
      path: '/admin/reports',
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: 'Marketing',
      path: '/admin/marketing',
      icon: <Megaphone className="h-5 w-5" />,
    },
    {
      name: 'Store',
      path: '/admin/store',
      icon: <Store className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 border-r">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-primary">Tiffah Admin</h1>
          </div>
          
          <div className="flex-grow py-4 overflow-y-auto">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant={window.location.pathname === item.path ? "secondary" : "ghost"}
                  className="w-full justify-start"
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
                <SheetContent side="left" className="lg:hidden p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                      <h1 className="text-xl font-bold text-primary">Tiffah Admin</h1>
                    </div>
                    
                    <div className="flex-grow py-4 overflow-y-auto">
                      <nav className="space-y-1 px-2">
                        {navItems.map((item) => (
                          <Button
                            key={item.name}
                            variant={window.location.pathname === item.path ? "secondary" : "ghost"}
                            className="w-full justify-start"
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
              <h1 className="text-lg font-semibold lg:hidden">Tiffah Admin</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user?.name || "Admin"} />
                      <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "A"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.name || "Admin User"}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                      <span className="text-xs text-muted-foreground">Administrator</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
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
        <main className="flex-grow p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
