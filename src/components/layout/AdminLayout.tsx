import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Package,
  ShoppingBag,
  Users,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Tag,
  Truck,
  Settings,
  User,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  
  // Admin sidebar navigation items
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', roles: ['admin', 'productManager', 'orderPreparer', 'deliveryStaff'] },
    { icon: Package, label: 'Products', path: '/admin/products', roles: ['admin', 'productManager'] },
    { icon: Tag, label: 'Categories', path: '/admin/categories', roles: ['admin'] },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders', roles: ['admin', 'orderPreparer'] },
    { icon: Truck, label: 'Deliveries', path: '/admin/deliveries', roles: ['admin', 'deliveryStaff'] },
    { icon: Users, label: 'Users', path: '/admin/users', roles: ['admin'] },
    { icon: Settings, label: 'Settings', path: '/admin/settings', roles: ['admin'] },
  ];
  
  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  // Auto logout after 15 minutes of inactivity for staff
  useEffect(() => {
    if (!user || user.role === 'customer') return;
    
    const resetIdleTime = () => setIdleTime(0);
    const incrementIdleTime = () => setIdleTime(prev => prev + 1);
    
    // Reset idle time on user activity
    window.addEventListener('mousemove', resetIdleTime);
    window.addEventListener('keypress', resetIdleTime);
    window.addEventListener('click', resetIdleTime);
    window.addEventListener('scroll', resetIdleTime);
    
    // Increment idle time every minute
    const idleInterval = setInterval(incrementIdleTime, 60000);
    
    // Check if idle time exceeds 15 minutes (staff only)
    const checkIdleInterval = setInterval(() => {
      if (idleTime >= 15) {
        signOut().then(() => {
          navigate('/auth');
        });
      }
    }, 60000);
    
    return () => {
      window.removeEventListener('mousemove', resetIdleTime);
      window.removeEventListener('keypress', resetIdleTime);
      window.removeEventListener('click', resetIdleTime);
      window.removeEventListener('scroll', resetIdleTime);
      clearInterval(idleInterval);
      clearInterval(checkIdleInterval);
    };
  }, [user, idleTime, signOut, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-sidebar-background border-r border-sidebar-border fixed h-full">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold">
              <span className="text-gradient">Tiffah</span>
              <span className="text-foreground">Admin</span>
            </h1>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground mr-3">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">{user?.email}</p>
              <p className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 w-full fixed top-0 left-0 z-30 bg-background border-b border-border">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-bold">
            <span className="text-gradient">Tiffah</span>
            <span className="text-foreground">Admin</span>
          </h1>
        </Link>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-background/90 backdrop-blur-sm">
          <div className="flex flex-col pt-16 pb-6 h-full">
            <nav className="flex-1 px-4 py-4 space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                return (
                  <Link 
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                        : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            
            <div className="px-4 border-t border-sidebar-border pt-4">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground mr-3">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground">{user?.email}</p>
                  <p className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-start"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-6 md:pt-0">
        <div className="px-4 py-4 md:py-6 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
