import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Truck, Package, Scan, Navigation2, Phone, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MobileDeliveryApp from '@/components/mobile/MobileDeliveryApp';
import ProductScanner from '@/components/barcode/ProductScanner';
import OrderScanner from '@/components/barcode/OrderScanner';
import { toast } from 'sonner';

const PENDING_DELIVERIES = [
  {
    id: 'DEL001',
    orderId: 'TTS-20250410-0001',
    customer: 'Jane Smith',
    address: '123 Kimathi Street, Nairobi',
    items: 3,
    scheduledTime: '10:00 AM - 12:00 PM',
    phone: '+254712345678'
  },
  {
    id: 'DEL002',
    orderId: 'TTS-20250410-0002',
    customer: 'John Doe',
    address: '456 Moi Avenue, Nairobi',
    items: 1,
    scheduledTime: '1:00 PM - 3:00 PM',
    phone: '+254723456789'
  }
];

const COMPLETED_DELIVERIES = [
  {
    id: 'DEL000',
    orderId: 'TTS-20250409-0003',
    customer: 'Alice Johnson',
    address: '789 Kenyatta Avenue, Nairobi',
    items: 2,
    scheduledTime: '9:00 AM - 11:00 AM',
    completedAt: '10:15 AM',
    phone: '+254734567890'
  }
];

const DeliveryStaff = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const navigate = useNavigate();

  const handleStartDelivery = (delivery: typeof PENDING_DELIVERIES[0]) => {
    toast.success(`Started delivery to ${delivery.customer}`);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(delivery.address)}`,
      '_blank'
    );
  };

  const handleCallCustomer = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleScanComplete = (code: string) => {
    toast.success(`Scanned code: ${code}`);
  };

  if (viewMode === 'mobile') {
    return <MobileDeliveryApp />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track your deliveries
          </p>
        </div>
        <Button onClick={() => setViewMode('mobile')}>
          <Phone className="mr-2 h-4 w-4" />
          Open Mobile App
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="scan">Scan</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Package className="mr-2 h-5 w-5 text-primary" />
                  Pending Deliveries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{PENDING_DELIVERIES.length}</div>
                <p className="text-sm text-muted-foreground">Scheduled for today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-primary" />
                  Completed Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{COMPLETED_DELIVERIES.length}</div>
                <p className="text-sm text-muted-foreground">Out of {PENDING_DELIVERIES.length + COMPLETED_DELIVERIES.length} scheduled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Average Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">28 min</div>
                <p className="text-sm text-muted-foreground">Per delivery</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Today's Deliveries</CardTitle>
              <CardDescription>Manage your scheduled deliveries for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-medium">Pending ({PENDING_DELIVERIES.length})</h3>
                {PENDING_DELIVERIES.map((delivery) => (
                  <div key={delivery.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{delivery.customer}</h4>
                        <p className="text-sm text-muted-foreground">{delivery.address}</p>
                      </div>
                      <Badge variant="outline" size="sm">
                        Order #{delivery.orderId.split('-').pop()}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4 mr-1" />
                      {delivery.scheduledTime} • {delivery.items} {delivery.items === 1 ? 'item' : 'items'}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleCallCustomer(delivery.phone)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleStartDelivery(delivery)}
                      >
                        <Navigation2 className="h-4 w-4 mr-2" />
                        Start Delivery
                      </Button>
                    </div>
                  </div>
                ))}

                <h3 className="font-medium mt-6">Completed Today ({COMPLETED_DELIVERIES.length})</h3>
                {COMPLETED_DELIVERIES.map((delivery) => (
                  <div key={delivery.id} className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{delivery.customer}</h4>
                        <p className="text-sm text-muted-foreground">{delivery.address}</p>
                      </div>
                      <Badge variant="outline" size="sm">
                        Order #{delivery.orderId.split('-').pop()}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      Completed at {delivery.completedAt}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Delivery Map</CardTitle>
              <CardDescription>View and optimize your delivery routes</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127635.66247630147!2d36.752610273193356!3d-1.3028617905594762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11655c311541%3A0x9dd769ac1c10b897!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1650123456789!5m2!1sen!2sus" 
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-b-lg"
              ></iframe>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scan" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OrderScanner 
              onScanComplete={handleScanComplete}
            />
            
            <ProductScanner 
              onScanComplete={handleScanComplete}
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery History</CardTitle>
              <CardDescription>View your past deliveries and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Delivery history will be displayed here</p>
                {/* Delivery history table would go here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryStaff;
