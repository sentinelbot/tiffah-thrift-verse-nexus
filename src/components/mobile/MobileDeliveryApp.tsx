
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Check, MapPin, Package, Camera, Clock, Phone, ShoppingBag, Navigation, X 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { isOnline } from '@/utils/scannerUtils';
import OrderScanner from '@/components/barcode/OrderScanner';

// Mocked delivery data
const DELIVERIES = [
  {
    id: 'DEL-001',
    orderId: 'TTS-20250410-0001',
    customerName: 'Jane Doe',
    address: '123 Kimathi Street, Nairobi',
    phone: '+254712345678',
    items: [
      { id: 'P001', name: 'Floral Summer Dress', quantity: 1 },
      { id: 'P002', name: 'Denim Jacket', quantity: 1 }
    ],
    status: 'pending',
    scheduledTime: '10:00 AM - 12:00 PM',
    notes: 'Call when arriving'
  },
  {
    id: 'DEL-002',
    orderId: 'TTS-20250410-0002',
    customerName: 'John Smith',
    address: '456 Moi Avenue, Nairobi',
    phone: '+254723456789',
    items: [
      { id: 'P003', name: 'Leather Boots', quantity: 1 }
    ],
    status: 'in_progress',
    scheduledTime: '1:00 PM - 3:00 PM',
    notes: ''
  },
  {
    id: 'DEL-003',
    orderId: 'TTS-20250409-0003',
    customerName: 'Alice Johnson',
    address: '789 Kenyatta Avenue, Nairobi',
    phone: '+254734567890',
    items: [
      { id: 'P004', name: 'Vintage Handbag', quantity: 1 },
      { id: 'P005', name: 'Silk Scarf', quantity: 2 }
    ],
    status: 'completed',
    scheduledTime: '4:00 PM - 6:00 PM',
    notes: 'Leave at the reception'
  }
];

const MobileDeliveryApp = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDelivery, setSelectedDelivery] = useState<typeof DELIVERIES[0] | null>(null);
  const [view, setView] = useState<'list' | 'details' | 'confirm' | 'scan'>('list');
  const [deliveryPhoto, setDeliveryPhoto] = useState<string | null>(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [pendingSync, setPendingSync] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const offline = !isOnline();

  useEffect(() => {
    // Check for pending offline deliveries to sync
    const offlineData = localStorage.getItem('pendingDeliveries');
    if (offlineData) {
      try {
        const parsedData = JSON.parse(offlineData);
        setPendingSync(parsedData);
      } catch (e) {
        console.error('Error parsing offline data:', e);
      }
    }
  }, []);

  const handleSelectDelivery = (delivery: typeof DELIVERIES[0]) => {
    setSelectedDelivery(delivery);
    setView('details');
  };

  const handleStartDelivery = () => {
    if (!selectedDelivery) return;
    
    // In a real app, this would update the status in the database
    toast.success(`Started delivery to ${selectedDelivery.customerName}`);
    
    // Open navigation in a new tab
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedDelivery.address)}`,
      '_blank'
    );
  };

  const handleScanOrder = (orderId: string) => {
    // In a real app, this would fetch the order details
    const matchingDelivery = DELIVERIES.find(d => d.orderId === orderId);
    
    if (matchingDelivery) {
      setSelectedDelivery(matchingDelivery);
      setView('details');
      toast.success(`Found delivery for order ${orderId}`);
    } else {
      toast.error(`No delivery found for order ${orderId}`);
      setView('list');
    }
  };

  const handleCallCustomer = () => {
    if (!selectedDelivery) return;
    window.open(`tel:${selectedDelivery.phone}`, '_self');
  };

  const handleCapturePhoto = () => {
    // In a real app, this would access the camera
    // For now, we'll simulate with a placeholder
    setDeliveryPhoto('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlY2VjZWMiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMThweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmaWxsPSIjNTU1NTU1Ij5EZWxpdmVyeSBQaG90bzwvdGV4dD4KPC9zdmc+Cg==');
    toast.success('Photo captured');
  };

  const handleCompleteDelivery = () => {
    if (!selectedDelivery) return;
    
    if (offline) {
      // Store delivery completion data locally for later sync
      const newPendingSync = [...pendingSync, selectedDelivery.id];
      localStorage.setItem('pendingDeliveries', JSON.stringify(newPendingSync));
      setPendingSync(newPendingSync);
      toast.success('Delivery marked as completed offline. Will sync when back online.');
    } else {
      // In a real app, this would update the database
      toast.success(`Delivery to ${selectedDelivery.customerName} completed!`);
    }
    
    setView('list');
    setDeliveryPhoto(null);
    setDeliveryNotes('');
    setSignature(null);
  };

  const syncPendingDeliveries = () => {
    // In a real app, this would sync with the server
    toast.success(`Synced ${pendingSync.length} deliveries`);
    localStorage.removeItem('pendingDeliveries');
    setPendingSync([]);
  };

  const renderDeliveryList = (status: string) => {
    const filteredDeliveries = DELIVERIES.filter(d => {
      if (status === 'pending') return d.status === 'pending';
      if (status === 'in_progress') return d.status === 'in_progress';
      if (status === 'completed') return d.status === 'completed';
      return true;
    });
    
    if (filteredDeliveries.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          No deliveries found
        </div>
      );
    }
    
    return filteredDeliveries.map(delivery => (
      <Card key={delivery.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{delivery.customerName}</CardTitle>
            <Badge variant={
              delivery.status === 'completed' ? 'success' : 
              delivery.status === 'in_progress' ? 'default' : 'outline'
            }>
              {delivery.status === 'pending' ? 'Pending' : 
               delivery.status === 'in_progress' ? 'In Progress' : 
               'Completed'}
            </Badge>
          </div>
          <CardDescription>{delivery.address}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-sm text-muted-foreground mb-2">
            <Clock className="inline-block w-4 h-4 mr-1" />
            {delivery.scheduledTime}
          </div>
          <div className="text-sm font-medium">
            {delivery.items.length} {delivery.items.length === 1 ? 'item' : 'items'}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-2"
            onClick={() => window.open(`tel:${delivery.phone}`, '_self')}
          >
            <Phone className="w-4 h-4 mr-1" />
            Call
          </Button>
          <Button 
            size="sm"
            onClick={() => handleSelectDelivery(delivery)}
          >
            <Package className="w-4 h-4 mr-1" />
            View Details
          </Button>
        </CardFooter>
      </Card>
    ));
  };

  if (view === 'scan') {
    return (
      <div className="container max-w-md mx-auto p-4">
        <OrderScanner 
          onBack={() => setView('list')}
          onScanComplete={handleScanOrder}
        />
      </div>
    );
  }
  
  if (view === 'details' && selectedDelivery) {
    return (
      <div className="container max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-8 -ml-2 mb-1" 
                  onClick={() => setView('list')}
                >
                  <X className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <CardTitle>{selectedDelivery.customerName}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {selectedDelivery.address}
                </CardDescription>
              </div>
              <Badge variant={
                selectedDelivery.status === 'completed' ? 'success' : 
                selectedDelivery.status === 'in_progress' ? 'default' : 'outline'
              }>
                {selectedDelivery.status === 'pending' ? 'Pending' : 
                 selectedDelivery.status === 'in_progress' ? 'In Progress' : 
                 'Completed'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Delivery Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Order ID:</div>
                <div>{selectedDelivery.orderId}</div>
                <div className="text-muted-foreground">Scheduled Time:</div>
                <div>{selectedDelivery.scheduledTime}</div>
                <div className="text-muted-foreground">Phone:</div>
                <div>{selectedDelivery.phone}</div>
                {selectedDelivery.notes && (
                  <>
                    <div className="text-muted-foreground">Notes:</div>
                    <div>{selectedDelivery.notes}</div>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Items</h3>
              <div className="space-y-2">
                {selectedDelivery.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-secondary/50 p-2 rounded">
                    <div className="flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{item.name}</span>
                    </div>
                    <Badge variant="outline">x{item.quantity}</Badge>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedDelivery.status !== 'completed' && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Delivery Confirmation</h3>
                
                {!deliveryPhoto ? (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleCapturePhoto}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture Delivery Photo
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="border rounded overflow-hidden">
                      <img src={deliveryPhoto} alt="Delivery confirmation" className="w-full" />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      onClick={handleCapturePhoto}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Retake Photo
                    </Button>
                  </div>
                )}
                
                <Textarea 
                  placeholder="Add delivery notes..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="resize-none"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {selectedDelivery.status !== 'completed' ? (
              <>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button 
                    variant="outline" 
                    onClick={handleCallCustomer}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Customer
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleStartDelivery}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigate
                  </Button>
                </div>
                <Button 
                  onClick={handleCompleteDelivery}
                  className="w-full"
                  disabled={!deliveryPhoto}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Complete Delivery
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setView('list')}
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Delivery App</h1>
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/staff')}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {offline && (
        <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-md mb-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            You're currently offline. Delivery confirmations will be saved locally and synchronized when you're back online.
          </p>
          {pendingSync.length > 0 && (
            <Button 
              size="sm" 
              className="mt-2 bg-yellow-800 hover:bg-yellow-700 text-white"
              onClick={syncPendingDeliveries}
              disabled={offline}
            >
              Sync {pendingSync.length} pending {pendingSync.length === 1 ? 'delivery' : 'deliveries'}
            </Button>
          )}
        </div>
      )}
      
      <div className="mb-4 flex justify-between">
        <Button 
          onClick={() => setView('scan')} 
          variant="outline"
        >
          <Camera className="w-4 h-4 mr-2" />
          Scan Order
        </Button>
        <Input 
          placeholder="Search deliveries..." 
          className="max-w-[60%]"
        />
      </div>
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {renderDeliveryList('pending')}
        </TabsContent>
        
        <TabsContent value="in_progress">
          {renderDeliveryList('in_progress')}
        </TabsContent>
        
        <TabsContent value="completed">
          {renderDeliveryList('completed')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileDeliveryApp;
