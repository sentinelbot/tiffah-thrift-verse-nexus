
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Layers, 
  Printer, 
  BarcodeScan,
  BrainCircuit, 
  Settings, 
  Menu, 
  X, 
  Users,
  BarChart2,
  Megaphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ConnectivityIndicator } from '@/components/ui/connectivity-indicator';

const Sidebar = ({ className }: { className?: string }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  
  const role = user?.role || 'admin';
  
  const isRoleAllowed = (allowedRoles: string[]) => {
    return allowedRoles.includes(role);
  };
  
  const routes = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
      active: pathname === '/admin',
      allowedRoles: ['admin', 'productManager', 'orderPreparer', 'deliveryStaff']
    },
    {
      label: 'Products',
      icon: Package,
      href: '/admin/products',
      active: pathname.includes('/admin/products'),
      allowedRoles: ['admin', 'productManager']
    },
    {
      label: 'Orders',
      icon: ShoppingCart,
      href: '/admin/orders',
      active: pathname.includes('/admin/orders'),
      allowedRoles: ['admin', 'orderPreparer', 'deliveryStaff']
    },
    {
      label: 'Categories',
      icon: Layers,
      href: '/admin/categories',
      active: pathname.includes('/admin/categories'),
      allowedRoles: ['admin', 'productManager']
    },
    {
      label: 'Printing',
      icon: Printer,
      href: '/admin/printing',
      active: pathname === '/admin/printing',
      allowedRoles: ['admin', 'productManager', 'orderPreparer', 'deliveryStaff']
    },
    {
      label: 'Scanning',
      icon: BarcodeScan,
      href: '/admin/scanning',
      active: pathname === '/admin/scanning',
      allowedRoles: ['admin', 'productManager', 'orderPreparer', 'deliveryStaff']
    },
    {
      label: 'Analytics',
      icon: BarChart2,
      href: '/admin/analytics',
      active: pathname === '/admin/analytics',
      allowedRoles: ['admin']
    },
    {
      label: 'Marketing',
      icon: Megaphone,
      href: '/admin/marketing',
      active: pathname === '/admin/marketing',
      allowedRoles: ['admin']
    },
    {
      label: 'Users',
      icon: Users,
      href: '/admin/users',
      active: pathname === '/admin/users',
      allowedRoles: ['admin']
    },
    {
      label: 'AI Dashboard',
      icon: BrainCircuit,
      href: '/admin/ai',
      active: pathname === '/admin/ai',
      allowedRoles: ['admin', 'productManager']
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/admin/settings',
      active: pathname === '/admin/settings',
      allowedRoles: ['admin']
    }
  ];
  
  return (
    <div className={cn("py-4 h-full flex flex-col", className)}>
      <div className="px-4 py-2 flex items-center border-b mb-4">
        <h2 className="text-xl font-bold text-primary">Tiffah Admin</h2>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {routes.filter(route => isRoleAllowed(route.allowedRoles)).map((route, index) => (
            <Button
              key={index}
              variant={route.active ? "secondary" : "ghost"}
              className={cn("w-full justify-start", route.active && "bg-muted")}
              asChild
            >
              <Link to={route.href}>
                <route.icon className="h-4 w-4 mr-3" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="px-3 py-2 mt-auto border-t">
        <ConnectivityIndicator className="mx-0 my-2" />
        <div className="flex items-center gap-2">
          <div className="rounded-full h-8 w-8 bg-primary flex items-center justify-center">
            <span className="text-white font-semibold">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="text-sm truncate">
            <p className="font-medium">{user?.name || user?.email || 'Admin User'}</p>
            <p className="text-muted-foreground capitalize">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  return (
    <div className="h-screen flex">
      <aside className="hidden lg:block w-64 border-r h-full">
        <Sidebar />
      </aside>
      
      <div className="lg:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 z-10"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close Menu</span>
              </Button>
            </div>
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
      
      <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
