
import React, { useState, ReactNode } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Package, 
  Truck, 
  ScanBarcode, 
  BarChart4, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Bell,
  MessageSquare,
  SidebarOpen,
  SidebarClose,
  Sparkles,
  Store,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const getInitials = () => {
    if (!user?.name) return 'A';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
  const navItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      title: 'Users',
      path: '/admin/users',
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingBag className="h-5 w-5" />
    },
    {
      title: 'Products',
      path: '/admin/products',
      icon: <Package className="h-5 w-5" />
    },
    {
      title: 'Deliveries',
      path: '/admin/deliveries',
      icon: <Truck className="h-5 w-5" />
    },
    {
      title: 'Scanning',
      path: '/admin/scanning',
      icon: <ScanBarcode className="h-5 w-5" />
    },
    {
      title: 'Reports',
      path: '/admin/reports',
      icon: <BarChart4 className="h-5 w-5" />
    },
    {
      title: 'Marketing',
      path: '/admin/marketing',
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      title: 'Store',
      path: '/admin/store',
      icon: <Store className="h-5 w-5" />
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-10 flex h-full w-64 flex-col border-r bg-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:w-20"
        )}
      >
        <div className="flex h-14 items-center px-4 border-b">
          <Link to="/admin" className="flex items-center gap-2">
            {isSidebarOpen ? (
              <span className="text-xl font-bold text-primary">Tiffah Admin</span>
            ) : (
              <span className="text-xl font-bold text-primary">TTS</span>
            )}
          </Link>
        </div>
        
        <nav className="flex-1 overflow-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive(item.path) 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.icon}
                  {isSidebarOpen && <span className="ml-3">{item.title}</span>}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt={user?.name || 'Admin'} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@example.com'}</p>
              </div>
            )}
            {isSidebarOpen ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="lg:flex hidden"
              >
                <SidebarClose className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:flex hidden"
              >
                <SidebarOpen className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {isSidebarOpen && (
            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open('/', '_blank')}
              >
                <Store className="h-4 w-4 mr-2" />
                View Store
                <ArrowUpRight className="h-3 w-3 ml-auto" />
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="absolute left-4 top-3 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex h-14 items-center px-4 border-b">
            <Link to="/admin" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="text-xl font-bold text-primary">Tiffah Admin</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <nav className="flex-1 overflow-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive(item.path) 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "hover:bg-muted"
                    )}
                    onClick={() => handleNavigate(item.path)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt={user?.name || 'Admin'} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@example.com'}</p>
              </div>
            </div>
            
            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  window.open('/', '_blank');
                  setIsMobileMenuOpen(false);
                }}
              >
                <Store className="h-4 w-4 mr-2" />
                View Store
                <ArrowUpRight className="h-3 w-3 ml-auto" />
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="flex h-14 items-center gap-4 border-b px-4 lg:px-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div className="flex-1 hidden md:flex">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search admin..." 
                className="pl-9 w-[300px]"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            
            <Button 
              variant="ghost"
              className="hidden md:flex gap-2 items-center text-sm"
              onClick={() => navigate("/admin/profile")}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg" alt={user?.name || 'Admin'} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <span>{user?.name || 'Admin'}</span>
            </Button>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
