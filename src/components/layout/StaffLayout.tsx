
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  QrCode, 
  Calendar, 
  MessageSquare, 
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface StaffLayoutProps {
  children: React.ReactNode;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  // Determine navigation items based on staff role
  const getNavItems = () => {
    const commonItems = [
      { path: '/staff', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
      { path: '/staff/communications', icon: <MessageSquare className="h-5 w-5" />, label: 'Communications' },
      { path: '/staff/schedule', icon: <Calendar className="h-5 w-5" />, label: 'Schedule' },
      { path: '/staff/profile', icon: <User className="h-5 w-5" />, label: 'Profile' },
    ];
    
    const roleSpecificItems = [];
    
    if (user?.role === 'productManager') {
      roleSpecificItems.push(
        { path: '/staff/product-manager', icon: <Package className="h-5 w-5" />, label: 'Inventory' },
        { path: '/staff/scanning', icon: <QrCode className="h-5 w-5" />, label: 'Scanning' }
      );
    } else if (user?.role === 'orderPreparer') {
      roleSpecificItems.push(
        { path: '/staff/order-preparer', icon: <Package className="h-5 w-5" />, label: 'Orders' },
        { path: '/staff/scanning', icon: <QrCode className="h-5 w-5" />, label: 'Scanning' }
      );
    } else if (user?.role === 'deliveryStaff') {
      roleSpecificItems.push(
        { path: '/staff/delivery-staff', icon: <Truck className="h-5 w-5" />, label: 'Deliveries' },
        { path: '/staff/scanning', icon: <QrCode className="h-5 w-5" />, label: 'Scanning' }
      );
    }
    
    return [...roleSpecificItems, ...commonItems];
  };
  
  const navItems = getNavItems();
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-card border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-primary">Tiffah Staff</h1>
          <p className="text-sm text-muted-foreground">{user?.role}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full flex items-center justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="flex flex-col flex-1">
        <header className="md:hidden bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">Tiffah Staff</h1>
            {/* Mobile menu button would go here */}
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
