
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Truck, 
  Package, 
  Search, 
  MapPin, 
  CameraIcon, 
  CheckCircle,
  Calendar,
  Phone,
  ClockIcon,
  ArrowUpRight,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

// Mock delivery data
const mockDeliveries = {
  assigned: [
    {
      id: "DEL-20250407-0001",
      orderNumber: "TTS-20250406-0001",
      customer: {
        name: "Bob Williams",
        phone: "+254 745 678 901",
        email: "bob@example.com"
      },
      items: [
        { name: "Wool Sweater", quantity: 1 },
        { name: "Winter Gloves", quantity: 1 }
      ],
      address: {
        street: "101 Thika Road",
        city: "Nairobi",
        state: "Nairobi",
        postalCode: "00300",
        country: "Kenya",
        instructions: "Leave with security if not available"
      },
      status: "assigned",
      estimatedDelivery: "Today, 2-4 PM",
      distance: "5.2 km"
    },
    {
      id: "DEL-20250407-0002",
      orderNumber: "TTS-20250406-0002",
      customer: {
        name: "Sarah Johnson",
        phone: "+254 756 789 012",
        email: "sarah@example.com"
      },
      items: [
        { name: "Leather Handbag", quantity: 1 }
      ],
      address: {
        street: "25 Kilimani Road",
        city: "Nairobi",
        state: "Nairobi",
        postalCode: "00100",
        country: "Kenya",
        instructions: null
      },
      status: "assigned",
      estimatedDelivery: "Today, 4-6 PM",
      distance: "3.8 km"
    }
  ],
  inProgress: [
    {
      id: "DEL-20250407-0003",
      orderNumber: "TTS-20250406-0003",
      customer: {
        name: "Michael Brown",
        phone: "+254 767 890 123",
        email: "michael@example.com"
      },
      items: [
        { name: "Linen Shirt", quantity: 1 },
        { name: "Chino Pants", quantity: 1 }
      ],
      address: {
        street: "78 Waiyaki Way",
        city: "Nairobi",
        state: "Nairobi",
        postalCode: "00200",
        country: "Kenya",
        instructions: "Call upon arrival"
      },
      status: "inProgress",
      estimatedDelivery: "Today, 1-3 PM",
      distance: "7.5 km"
    }
  ],
  completed: [
    {
      id: "DEL-20250406-0001",
      orderNumber: "TTS-20250405-0001",
      customer: {
        name: "Emily Davis",
        phone: "+254 778 901 234",
        email: "emily@example.com"
      },
      items: [
        { name: "Vintage Sunglasses", quantity: 1 },
        { name: "Summer Hat", quantity: 1 }
      ],
      address: {
        street: "15 Karen Road",
        city: "Nairobi",
        state: "Nairobi",
        postalCode: "00500",
        country: "Kenya",
        instructions: null
      },
      status: "completed",
      estimatedDelivery: "Yesterday, 10 AM - 12 PM",
      actualDelivery: "Yesterday, 11:23 AM",
      distance: "12.3 km"
    }
  ]
};

const DeliveryDetail = ({ delivery, onBack }: { delivery: any, onBack: () => void }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isCapturingProof, setIsCapturingProof] = useState(false);
  
  const handleStartDelivery = () => {
    setIsUpdatingStatus(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Delivery status updated to 'In Progress'");
      setIsUpdatingStatus(false);
      // In a real app, you would update the delivery status
    }, 1500);
  };
  
  const handleCaptureDelivery = () => {
    setIsCapturingProof(true);
    
    // Simulate capturing proof of delivery
    setTimeout(() => {
      toast.success("Proof of delivery captured successfully");
      setIsCapturingProof(false);
      
      // Wait a moment and then simulate completing delivery
      setTimeout(() => {
        toast.success("Delivery marked as completed");
        // In a real app, you would update the delivery status
      }, 1000);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Deliveries
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                Delivery #{delivery.id}
                <Badge className={`ml-3 ${
                  delivery.status === 'assigned' ? 'bg-yellow-500' : 
                  delivery.status === 'inProgress' ? 'bg-blue-500' : 
                  'bg-green-500'
                }`}>
                  {delivery.status === 'assigned' ? 'Assigned' : 
                   delivery.status === 'inProgress' ? 'In Progress' : 
                   'Completed'}
                </Badge>
              </CardTitle>
              <CardDescription>Order #{delivery.orderNumber}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                // This would ideally open maps app with directions
                toast.info("Opening navigation to customer's address");
              }}>
                <MapPin className="mr-2 h-4 w-4" />
                Navigate
              </Button>
              <Button variant="outline" onClick={() => {
                // This would ideally call the customer's phone number
                toast.info(`Calling customer: ${delivery.customer.phone}`);
              }}>
                <Phone className="mr-2 h-4 w-4" />
                Call
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row md:gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <p className="font-medium">{delivery.customer.name}</p>
                <p className="text-sm text-muted-foreground">{delivery.customer.phone}</p>
                <p className="text-sm text-muted-foreground">{delivery.customer.email}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Delivery Address</h3>
                <p className="text-sm">{delivery.address.street}</p>
                <p className="text-sm">
                  {delivery.address.city}, {delivery.address.state} {delivery.address.postalCode}
                </p>
                <p className="text-sm">{delivery.address.country}</p>
                {delivery.address.instructions && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    <span className="font-medium">Instructions: </span>
                    {delivery.address.instructions}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Items ({delivery.items.length})</h3>
                <div className="space-y-2">
                  {delivery.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between py-1">
                      <span>{item.name}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 mt-6 md:mt-0">
              <div>
                <h3 className="font-medium mb-2">Delivery Information</h3>
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-sm">
                    <span className="font-medium">Estimated: </span>
                    {delivery.estimatedDelivery}
                  </p>
                </div>
                
                {delivery.actualDelivery && (
                  <div className="flex items-center mb-2">
                    <ClockIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-sm">
                      <span className="font-medium">Delivered: </span>
                      {delivery.actualDelivery}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-sm">
                    <span className="font-medium">Distance: </span>
                    {delivery.distance}
                  </p>
                </div>
              </div>
              
              {delivery.status === 'assigned' && (
                <Button 
                  className="w-full mt-6" 
                  onClick={handleStartDelivery}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Truck className="mr-2 h-4 w-4" />
                      Start Delivery
                    </>
                  )}
                </Button>
              )}
              
              {delivery.status === 'inProgress' && (
                <Button 
                  className="w-full mt-6" 
                  onClick={handleCaptureDelivery}
                  disabled={isCapturingProof}
                >
                  {isCapturingProof ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Capturing...
                    </>
                  ) : (
                    <>
                      <CameraIcon className="mr-2 h-4 w-4" />
                      Capture Proof of Delivery
                    </>
                  )}
                </Button>
              )}
              
              {delivery.status === 'completed' && (
                <div className="bg-muted p-4 rounded-md mt-6 text-center">
                  <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <p className="font-medium">Delivery completed</p>
                  <p className="text-sm text-muted-foreground">
                    Delivered at {delivery.actualDelivery}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DeliveryStaff = () => {
  const [activeTab, setActiveTab] = useState("assigned");
  const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null);
  
  const handleDeliveryClick = (delivery: any) => {
    setSelectedDelivery(delivery);
  };
  
  if (selectedDelivery) {
    return <DeliveryDetail delivery={selectedDelivery} onBack={() => setSelectedDelivery(null)} />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Delivery Management</h1>
      
      <Tabs defaultValue="assigned" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="assigned">
            Assigned
            <Badge variant="outline" className="ml-2">{mockDeliveries.assigned.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inProgress">
            In Progress
            <Badge variant="outline" className="ml-2">{mockDeliveries.inProgress.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="outline" className="ml-2">{mockDeliveries.completed.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search deliveries..." className="pl-8" />
        </div>
        
        <TabsContent value="assigned" className="space-y-4">
          {mockDeliveries.assigned.map((delivery) => (
            <Card 
              key={delivery.id} 
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleDeliveryClick(delivery)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="font-medium flex items-center">
                      Delivery #{delivery.id}
                      <Badge className="ml-2 bg-yellow-500">Assigned</Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">Order #{delivery.orderNumber}</p>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-sm">{delivery.estimatedDelivery}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{delivery.address.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {delivery.address.city}, {delivery.address.state}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">
                      Distance: {delivery.distance}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">{delivery.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{delivery.customer.phone}</p>
                    <p className="text-sm text-muted-foreground">
                      Items: {delivery.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Opening navigation to customer's address");
                    }}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Navigate
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success("Delivery status updated to 'In Progress'");
                    }}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Start Delivery
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="inProgress" className="space-y-4">
          {mockDeliveries.inProgress.map((delivery) => (
            <Card 
              key={delivery.id} 
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleDeliveryClick(delivery)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="font-medium flex items-center">
                      Delivery #{delivery.id}
                      <Badge className="ml-2 bg-blue-500">In Progress</Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">Order #{delivery.orderNumber}</p>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-sm">{delivery.estimatedDelivery}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{delivery.address.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {delivery.address.city}, {delivery.address.state}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">
                      Distance: {delivery.distance}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">{delivery.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{delivery.customer.phone}</p>
                    <p className="text-sm text-muted-foreground">
                      Items: {delivery.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success("Proof of delivery captured successfully");
                      setTimeout(() => {
                        toast.success("Delivery marked as completed");
                      }, 1000);
                    }}
                  >
                    <CameraIcon className="mr-2 h-4 w-4" />
                    Complete Delivery
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {mockDeliveries.completed.map((delivery) => (
            <Card 
              key={delivery.id} 
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleDeliveryClick(delivery)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="font-medium flex items-center">
                      Delivery #{delivery.id}
                      <Badge className="ml-2 bg-green-500">Completed</Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">Order #{delivery.orderNumber}</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    <p className="text-sm">{delivery.actualDelivery}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm">{delivery.address.street}</p>
                    <p className="text-sm text-muted-foreground">
                      {delivery.address.city}, {delivery.address.state}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">{delivery.customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Items: {delivery.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryStaff;
