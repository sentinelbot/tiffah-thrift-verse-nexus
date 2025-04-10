import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Truck, 
  Package, 
  Check, 
  Clock, 
  Camera,
  Menu,
  X,
  ChevronLeft,
  Home,
  User,
  Bell,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import DeliveryScanner from '@/components/barcode/DeliveryScanner';
import OfflineDeliveryNotice from './OfflineDeliveryNotice';
import { useIsMobile } from '@/hooks/use-mobile';

const deliveries = [
  {
    id: 'DEL-001',
    orderNumber: 'TTS-20240410-0001',
    customer: {
      name: 'Jane Smith',
      phone: '+254712345678',
      address: {
        street: '123 Kimathi Street',
        city: 'Nairobi',
        zipCode: '00100'
      }
    },
    items: [
      {
        id: 'ITEM-001',
        name: 'Vintage Denim Jacket',
        barcode: '1234567890'
      },
      {
        id: 'ITEM-002',
        name: 'Floral Summer Dress',
        barcode: '0987654321'
      }
    ],
    status: 'assigned',
    deliveryDate: '2024-04-10'
  },
  {
    id: 'DEL-002',
    orderNumber: 'TTS-20240410-0002',
    customer: {
      name: 'John Doe',
      phone: '+254723456789',
      address: {
        street: '456 Moi Avenue',
        city: 'Nairobi',
        zipCode: '00100'
      }
    },
    items: [
      {
        id: 'ITEM-003',
        name: 'Leather Boots',
        barcode: '5678901234'
      }
    ],
    status: 'in-progress',
    deliveryDate: '2024-04-10'
  },
  {
    id: 'DEL-003',
    orderNumber: 'TTS-20240410-0003',
    customer: {
      name: 'Alice Johnson',
      phone: '+254734567890',
      address: {
        street: '789 Tom Mboya Street',
        city: 'Nairobi',
        zipCode: '00100'
      }
    },
    items: [
      {
        id: 'ITEM-004',
        name: 'Cotton T-Shirt',
        barcode: '4321098765'
      },
      {
        id: 'ITEM-005',
        name: 'Linen Pants',
        barcode: '6789012345'
      }
    ],
    status: 'completed',
    deliveryDate: '2024-04-09'
  }
];

const MobileDeliveryApp = () => {
  const [activeTab, setActiveTab] = useState('assigned');
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const filteredDeliveries = deliveries.filter(delivery => {
    if (activeTab === 'assigned') return delivery.status === 'assigned';
    if (activeTab === 'in-progress') return delivery.status === 'in-progress';
    if (activeTab === 'completed') return delivery.status === 'completed';
    return true;
  });
  
  const handleDeliverySelect = (delivery: any) => {
    setSelectedDelivery(delivery);
  };
  
  const handleBack = () => {
    setSelectedDelivery(null);
    setIsScanning(false);
  };
  
  const handleScan = (data: string) => {
    console.log('Scanned barcode:', data);
    setIsScanning(false);
  };
  
  const handleScanClick = () => {
    setIsScanning(true);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen, isMobile]);
  
  if (isScanning) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-background p-4 flex items-center shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => setIsScanning(false)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium ml-2">Scan Barcode</h1>
        </div>
        <div className="flex-1">
          <DeliveryScanner onScan={handleScan} />
        </div>
      </div>
    );
  }
  
  if (selectedDelivery) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <div className="bg-background p-4 flex items-center shadow-sm">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium ml-2">Delivery Details</h1>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <OfflineDeliveryNotice className="mb-4" />
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {selectedDelivery.orderNumber}
                <Badge 
                  className={
                    selectedDelivery.status === 'completed' 
                      ? 'bg-green-500' 
                      : selectedDelivery.status === 'in-progress' 
                        ? 'bg-blue-500' 
                        : 'bg-yellow-500'
                  }
                >
                  {selectedDelivery.status === 'assigned' 
                    ? 'Assigned' 
                    : selectedDelivery.status === 'in-progress' 
                      ? 'In Progress' 
                      : 'Completed'}
                </Badge>
              </CardTitle>
              <CardDescription>
                Scheduled for {selectedDelivery.deliveryDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-secondary/50 p-3 rounded-md">
                <h3 className="font-medium mb-1">Customer Information</h3>
                <p className="text-sm">{selectedDelivery.customer.name}</p>
                <p className="text-sm">{selectedDelivery.customer.phone}</p>
                <div className="mt-1 text-sm text-muted-foreground">
                  <p>{selectedDelivery.customer.address.street}</p>
                  <p>{selectedDelivery.customer.address.city}, {selectedDelivery.customer.address.zipCode}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Items</h3>
                <div className="space-y-2">
                  {selectedDelivery.items.map((item: any) => (
                    <div key={item.id} className="bg-secondary/50 p-3 rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Barcode: {item.barcode}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button 
                  className="w-full" 
                  variant={selectedDelivery.status === 'assigned' ? 'default' : 'outline'}
                  disabled={selectedDelivery.status === 'completed'}
                >
                  Start Delivery
                </Button>
                <Button 
                  className="w-full" 
                  onClick={handleScanClick}
                  disabled={selectedDelivery.status === 'completed'}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Scan Items
                </Button>
              </div>
              
              {selectedDelivery.status !== 'completed' && (
                <Button 
                  className="w-full" 
                  variant="outline"
                  disabled={selectedDelivery.status === 'completed'}
                >
                  Mark as Delivered
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Delivery Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Call the customer before arriving. The building has security at the entrance.
                If no response, leave the package with the security guard and take a photo.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="p-4 border-t">
          <Button className="w-full" onClick={() => window.open(`https://maps.google.com?q=${encodeURIComponent(selectedDelivery.customer.address.street + ', ' + selectedDelivery.customer.address.city)}`, '_blank')}>
            <MapPin className="h-4 w-4 mr-2" />
            Navigate to Address
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="bg-background p-4 flex justify-between items-center shadow-sm">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">Deliveries</h1>
        <Button variant="ghost" size="icon" onClick={handleScanClick}>
          <Camera className="h-5 w-5" />
        </Button>
      </div>
      
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-background shadow-lg z-50">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold text-lg">Tiffah Thrift Store</h2>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
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
      )}
      
      <div className="flex-1 overflow-auto p-4">
        <OfflineDeliveryNotice className="mb-4" />
        
        <Tabs defaultValue="assigned" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assigned">
              <Package className="h-4 w-4 mr-2" />
              To Deliver
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              <Clock className="h-4 w-4 mr-2" />
              In Progress
            </TabsTrigger>
            <TabsTrigger value="completed">
              <Check className="h-4 w-4 mr-2" />
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-3">
          {filteredDeliveries.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No deliveries</h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'assigned' 
                  ? 'You have no pending deliveries.'
                  : activeTab === 'in-progress' 
                    ? 'You have no deliveries in progress.'
                    : 'You have no completed deliveries.'}
              </p>
            </div>
          ) : (
            filteredDeliveries.map(delivery => (
              <Card key={delivery.id} className="cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => handleDeliverySelect(delivery)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{delivery.orderNumber}</h3>
                      <p className="text-sm text-muted-foreground">{delivery.customer.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{delivery.customer.address.street}</p>
                      <p className="text-xs text-muted-foreground">{delivery.customer.address.city}, {delivery.customer.address.zipCode}</p>
                    </div>
                    <Badge 
                      className={
                        delivery.status === 'completed' 
                          ? 'bg-green-500' 
                          : delivery.status === 'in-progress' 
                            ? 'bg-blue-500' 
                            : 'bg-yellow-500'
                      }
                    >
                      {delivery.status === 'assigned' 
                        ? 'To Deliver' 
                        : delivery.status === 'in-progress' 
                          ? 'In Progress' 
                          : 'Completed'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Items: </span>
                      {delivery.items.length}
                    </div>
                    <Button size="sm" variant="outline">
                      <MapPin className="h-3.5 w-3.5 mr-1.5" />
                      View Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <div className="p-4 border-t grid grid-cols-2 gap-2">
        <Button onClick={handleScanClick}>
          <Camera className="h-4 w-4 mr-2" />
          Scan Barcode
        </Button>
        <Button variant="outline">
          <Clock className="h-4 w-4 mr-2" />
          Update Status
        </Button>
      </div>
    </div>
  );
};

export default MobileDeliveryApp;
