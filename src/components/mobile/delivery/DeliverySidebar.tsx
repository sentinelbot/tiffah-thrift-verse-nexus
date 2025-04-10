
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  X, 
  Truck, 
  User, 
  Bell, 
  BarChart 
} from 'lucide-react';

interface DeliverySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeliverySidebar = ({ isOpen, onClose }: DeliverySidebarProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-background shadow-lg z-50">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">Tiffah Thrift Store</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Delivery Staff</p>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 overflow-auto p-2">
            <Button variant="ghost" className="w-full justify-start mb-1" asChild>
              <a href="/staff">
                <Home className="h-5 w-5 mr-2" />
                Dashboard
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-1" asChild>
              <a href="/staff/delivery" className="bg-secondary/50">
                <Truck className="h-5 w-5 mr-2" />
                Deliveries
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-1" asChild>
              <a href="/staff/communications">
                <Bell className="h-5 w-5 mr-2" />
                Communications
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-1" asChild>
              <a href="/staff/profile">
                <User className="h-5 w-5 mr-2" />
                Profile
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-1" asChild>
              <a href="/staff/delivery/reports">
                <BarChart className="h-5 w-5 mr-2" />
                Reports
              </a>
            </Button>
          </nav>
          
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverySidebar;
