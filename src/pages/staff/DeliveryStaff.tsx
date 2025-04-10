
import React, { useState } from 'react';
import StaffLayout from '@/components/layout/StaffLayout';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  Truck, 
  Search, 
  MapPin, 
  Phone, 
  Camera, 
  CheckCircle, 
  Barcode, 
  Route, 
  Clock, 
  Calendar, 
  Package as PackageIcon, 
  MapPinned,
  Calculator,
  ChevronDown,
  Navigation,
  CheckSquare,
  AlertTriangle,
  MessageSquare,
  Image as ImageIcon,
  Loader2,
  Timer,
  PenSquare
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mock data for deliveries
const mockDeliveries = [
  {
    id: 'del-001',
    orderNumber: 'TTS-20250409-1234',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+254712345678'
    },
    status: 'assigned',
    items: [
      { id: 'prod-001', name: 'Vintage Denim Jacket', quantity: 1 },
      { id: 'prod-002', name: 'Floral Summer Dress', quantity: 1 }
    ],
    totalAmount: 4300,
    shippingMethod: 'standard',
    address: {
      street: '123 Main St',
      city: 'Nairobi',
      postalCode: '00100',
      coordinates: { lat: -1.286389, lng: 36.817223 }
    },
    assignedAt: '2025-04-09T12:30:00',
    estimatedDelivery: '2025-04-10T14:00:00',
    trackingId: 'TRK-12345',
    priority: 'normal',
    distance: 5.3,
    notes: ''
  },
  {
    id: 'del-002',
    orderNumber: 'TTS-20250409-1235',
    customer: {
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+254723456789'
    },
    status: 'intransit',
    items: [
      { id: 'prod-003', name: 'Leather Crossbody Bag', quantity: 1 }
    ],
    totalAmount: 3200,
    shippingMethod: 'express',
    address: {
      street: '456 Oak Ave',
      city: 'Nairobi',
      postalCode: '00200',
      coordinates: { lat: -1.266389, lng: 36.797223 }
    },
    assignedAt: '2025-04-09T11:45:00',
    estimatedDelivery: '2025-04-09T17:00:00',
    trackingId: 'TRK-12346',
    priority: 'high',
    distance: 3.8,
    notes: 'Customer requested to call before arrival',
    pickedUpAt: '2025-04-09T13:20:00'
  },
  {
    id: 'del-003',
    orderNumber: 'TTS-20250408-1232',
    customer: {
      name: 'David Johnson',
      email: 'david@example.com',
      phone: '+254734567890'
    },
    status: 'delivered',
    items: [
      { id: 'prod-005', name: 'Wool Winter Coat', quantity: 1 },
      { id: 'prod-004', name: 'Classic White Sneakers', quantity: 1 }
    ],
    totalAmount: 6700,
    shippingMethod: 'standard',
    address: {
      street: '789 Pine Rd',
      city: 'Mombasa',
      postalCode: '80100',
      coordinates: { lat: -4.043740, lng: 39.668221 }
    },
    assignedAt: '2025-04-08T10:15:00',
    estimatedDelivery: '2025-04-09T14:00:00',
    actualDelivery: '2025-04-09T13:42:00',
    trackingId: 'TRK-12347',
    priority: 'normal',
    distance: 6.7,
    notes: '',
    pickedUpAt: '2025-04-08T11:30:00',
    deliveryProof: {
      photo: '/placeholder.svg',
      signature: '/placeholder.svg',
      notes: 'Left with security guard at gate'
    }
  },
  {
    id: 'del-004',
    orderNumber: 'TTS-20250408-1231',
    customer: {
      name: 'Grace Onyango',
      email: 'grace@example.com',
      phone: '+254745678901'
    },
    status: 'failed',
    items: [
      { id: 'prod-002', name: 'Floral Summer Dress', quantity: 2 }
    ],
    totalAmount: 3600,
    shippingMethod: 'standard',
    address: {
      street: '321 Cedar Ln',
      city: 'Kisumu',
      postalCode: '40100',
      coordinates: { lat: -0.102222, lng: 34.761944 }
    },
    assignedAt: '2025-04-08T09:45:00',
    estimatedDelivery: '2025-04-09T14:00:00',
    failureReason: 'Customer not available at delivery location',
    trackingId: 'TRK-12348',
    priority: 'normal',
    distance: 7.2,
    notes: 'Cash on delivery',
    pickedUpAt: '2025-04-08T10:30:00',
    attemptedDelivery: '2025-04-08T14:20:00'
  },
  {
    id: 'del-005',
    orderNumber: 'TTS-20250407-1230',
    customer: {
      name: 'Robert Mwangi',
      email: 'robert@example.com',
      phone: '+254756789012'
    },
    status: 'ready',
    items: [
      { id: 'prod-001', name: 'Vintage Denim Jacket', quantity: 1 },
      { id: 'prod-003', name: 'Leather Crossbody Bag', quantity: 1 }
    ],
    totalAmount: 5700,
    shippingMethod: 'express',
    address: {
      street: '654 Elm St',
      city: 'Nairobi',
      postalCode: '00100',
      coordinates: { lat: -1.296389, lng: 36.827223 }
    },
    assignedAt: '2025-04-09T08:30:00',
    estimatedDelivery: '2025-04-09T16:00:00',
    trackingId: 'TRK-12349',
    priority: 'high',
    distance: 4.5,
    notes: 'Call customer on arrival'
  },
];

const DeliveryStaff: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');
  
  // Filter deliveries based on search query and active tab
  const filteredDeliveries = mockDeliveries.filter(delivery => {
    const matchesSearch = 
      delivery.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
      delivery.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.address.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'upcoming') {
      return (delivery.status === 'assigned' || delivery.status === 'ready') && matchesSearch;
    } else if (activeTab === 'intransit') {
      return delivery.status === 'intransit' && matchesSearch;
    } else if (activeTab === 'completed') {
      return (delivery.status === 'delivered' || delivery.status === 'failed') && matchesSearch;
    }
    
    return matchesSearch;
  });
  
  const handleDeliveryClick = (delivery: any) => {
    setSelectedDelivery(delivery);
    setActiveTab('delivery-detail');
  };
  
  const handleStatusChange = (deliveryId: string, newStatus: string) => {
    toast.success(`Delivery ${deliveryId} status updated to ${newStatus}`);
    
    if (newStatus === 'delivered') {
      setIsCapturingPhoto(false);
      toast.success('Delivery confirmation photo captured');
    }
  };
  
  const handleScanBarcode = () => {
    setIsScanningBarcode(true);
    
    // Simulate a barcode scan
    setTimeout(() => {
      setIsScanningBarcode(false);
      toast.success('Package verified successfully');
    }, 2000);
  };
  
  const handleCaptureDeliveryPhoto = () => {
    setIsCapturingPhoto(true);
    
    // Simulate photo capture
    setTimeout(() => {
      setIsCapturingPhoto(false);
      toast.success('Delivery confirmation photo captured');
    }, 2000);
  };
  
  const handleStartNavigation = (delivery: any) => {
    toast.success(`Starting navigation to ${delivery.address.street}, ${delivery.address.city}`);
    // In a real app, this would integrate with a mapping service like Google Maps
  };
  
  const handleSubmitDeliveryNote = () => {
    if (deliveryNote.trim() === '') return;
    
    toast.success('Delivery note saved');
    setDeliveryNote('');
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ready':
        return <Badge className="bg-blue-500">Ready for Pickup</Badge>;
      case 'assigned':
        return <Badge className="bg-yellow-500">Assigned</Badge>;
      case 'intransit':
        return <Badge className="bg-purple-500">In Transit</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Delivered</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'normal':
        return <Badge className="bg-blue-500">Normal</Badge>;
      case 'low':
        return <Badge className="bg-gray-500">Low</Badge>;
      default:
        return null;
    }
  };
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <StaffLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Delivery Management</h1>
            <p className="text-muted-foreground">Manage your delivery routes and track packages</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleScanBarcode} disabled={isScanningBarcode}>
              {isScanningBarcode ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Barcode className="h-4 w-4 mr-2" />
                  Scan Package
                </>
              )}
            </Button>
            <Button>
              <Route className="h-4 w-4 mr-2" />
              Optimize Route
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">
              <Clock className="h-4 w-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="intransit">
              <Truck className="h-4 w-4 mr-2" />
              In Transit
            </TabsTrigger>
            <TabsTrigger value="completed">
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="delivery-detail" disabled={!selectedDelivery}>
              <PackageIcon className="h-4 w-4 mr-2" />
              Delivery Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <CardTitle>Upcoming Deliveries</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search deliveries..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredDeliveries.map((delivery) => (
                    <Card key={delivery.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2 bg-muted/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex gap-2 items-center">
                              <h3 className="font-medium">{delivery.orderNumber}</h3>
                              {getStatusBadge(delivery.status)}
                              {getPriorityBadge(delivery.priority)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {delivery.items.length} {delivery.items.length === 1 ? 'item' : 'items'} • 
                              {delivery.shippingMethod} shipping
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={() => handleDeliveryClick(delivery)}>
                              View
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <div className="flex gap-2 items-center">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{delivery.customer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{delivery.customer.name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Timer className="h-4 w-4 text-muted-foreground" />
                              <span>Delivery by: {formatTime(delivery.estimatedDelivery)}</span>
                            </div>
                          </div>
                          
                          <div className="bg-muted/30 p-2 rounded-md flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{delivery.address.street}, {delivery.address.city}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <span>{delivery.distance} km</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-1">
                            {delivery.status === 'ready' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusChange(delivery.id, 'assigned')}
                              >
                                <PackageIcon className="h-4 w-4 mr-2" />
                                Pick Up Package
                              </Button>
                            )}
                            
                            {delivery.status === 'assigned' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusChange(delivery.id, 'intransit')}
                              >
                                <Truck className="h-4 w-4 mr-2" />
                                Start Delivery
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStartNavigation(delivery)}
                            >
                              <Navigation className="h-4 w-4 mr-2" />
                              Navigate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredDeliveries.length === 0 && (
                    <div className="text-center py-10">
                      <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Upcoming Deliveries</h3>
                      <p className="text-muted-foreground">
                        You have no pending deliveries at the moment.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="intransit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Deliveries In Progress</CardTitle>
                <CardDescription>Packages currently out for delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredDeliveries.map((delivery) => (
                    <Card key={delivery.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2 bg-purple-500/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex gap-2 items-center">
                              <h3 className="font-medium">{delivery.orderNumber}</h3>
                              {getStatusBadge(delivery.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(delivery.pickedUpAt || '')} • 
                              {delivery.shippingMethod} shipping
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={() => handleDeliveryClick(delivery)}>
                              View
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <div className="flex gap-2 items-center">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{delivery.customer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{delivery.customer.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <Button variant="link" size="sm" className="h-8 p-0">
                                {delivery.customer.phone}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="bg-muted/30 p-2 rounded-md flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{delivery.address.street}, {delivery.address.city}</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleStartNavigation(delivery)}>
                              <Navigation className="h-4 w-4 mr-2" />
                              Navigate
                            </Button>
                          </div>
                          
                          {delivery.notes && (
                            <div className="bg-yellow-500/10 p-2 rounded-md flex gap-2 items-start">
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                              <p className="text-sm">{delivery.notes}</p>
                            </div>
                          )}
                          
                          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-1">
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Contact Customer
                                </Button>
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>Contact Customer</SheetTitle>
                                  <SheetDescription>
                                    Send a message or call {delivery.customer.name}
                                  </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6 space-y-4">
                                  <div className="flex justify-between items-center">
                                    <div className="flex gap-3 items-center">
                                      <Avatar>
                                        <AvatarFallback>{delivery.customer.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{delivery.customer.name}</p>
                                        <p className="text-sm text-muted-foreground">{delivery.customer.phone}</p>
                                      </div>
                                    </div>
                                    <Button variant="outline" size="icon">
                                      <Phone className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <Separator />
                                  
                                  <div className="space-y-2">
                                    <Label>Quick Messages</Label>
                                    <div className="space-y-2">
                                      <Button variant="outline" className="w-full justify-start" size="sm">
                                        I'm on my way with your order.
                                      </Button>
                                      <Button variant="outline" className="w-full justify-start" size="sm">
                                        I've arrived at your location.
                                      </Button>
                                      <Button variant="outline" className="w-full justify-start" size="sm">
                                        I'll be there in approximately 15 minutes.
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2 pt-2">
                                    <Label>Custom Message</Label>
                                    <Textarea placeholder="Type your message here..." />
                                    <Button className="w-full">Send Message</Button>
                                  </div>
                                </div>
                              </SheetContent>
                            </Sheet>
                            
                            <Button 
                              size="sm" 
                              onClick={() => handleDeliveryClick(delivery)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete Delivery
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredDeliveries.length === 0 && (
                    <div className="text-center py-10">
                      <Truck className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Deliveries In Progress</h3>
                      <p className="text-muted-foreground">
                        You don't have any ongoing deliveries at the moment.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Deliveries</CardTitle>
                <CardDescription>Successfully delivered and failed delivery attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredDeliveries.map((delivery) => (
                    <Card key={delivery.id} className="overflow-hidden">
                      <CardHeader className={`p-4 pb-2 ${delivery.status === 'delivered' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex gap-2 items-center">
                              <h3 className="font-medium">{delivery.orderNumber}</h3>
                              {getStatusBadge(delivery.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(delivery.actualDelivery || delivery.attemptedDelivery || '')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={() => handleDeliveryClick(delivery)}>
                              View
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <div className="flex gap-2 items-center">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{delivery.customer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{delivery.customer.name}</span>
                            </div>
                            <span className="text-sm">{delivery.address.city}</span>
                          </div>
                          
                          {delivery.status === 'delivered' && delivery.deliveryProof && (
                            <div className="bg-muted/30 p-2 rounded-md">
                              <p className="text-sm font-medium mb-1">Delivery Notes:</p>
                              <p className="text-sm">{delivery.deliveryProof.notes || 'N/A'}</p>
                            </div>
                          )}
                          
                          {delivery.status === 'failed' && delivery.failureReason && (
                            <div className="bg-red-500/10 p-2 rounded-md flex gap-2 items-start">
                              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                              <p className="text-sm">{delivery.failureReason}</p>
                            </div>
                          )}
                          
                          <div className="flex justify-end gap-2 mt-1">
                            {delivery.status === 'failed' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusChange(delivery.id, 'intransit')}
                              >
                                <Truck className="h-4 w-4 mr-2" />
                                Retry Delivery
                              </Button>
                            )}
                            
                            {delivery.status === 'delivered' && (
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    View Proof
                                  </Button>
                                </SheetTrigger>
                                <SheetContent>
                                  <SheetHeader>
                                    <SheetTitle>Delivery Proof</SheetTitle>
                                    <SheetDescription>
                                      For order {delivery.orderNumber} delivered on {formatDateTime(delivery.actualDelivery || '')}
                                    </SheetDescription>
                                  </SheetHeader>
                                  <div className="mt-6 space-y-4">
                                    <div className="space-y-2">
                                      <Label>Delivery Photo</Label>
                                      <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                                        <img 
                                          src={delivery.deliveryProof?.photo} 
                                          alt="Delivery proof" 
                                          className="max-h-full rounded-md" 
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>Customer Signature</Label>
                                      <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                                        <img 
                                          src={delivery.deliveryProof?.signature} 
                                          alt="Customer signature" 
                                          className="max-h-full rounded-md" 
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>Delivery Notes</Label>
                                      <p className="text-sm p-2 bg-muted rounded-md">
                                        {delivery.deliveryProof?.notes || 'No notes provided'}
                                      </p>
                                    </div>
                                  </div>
                                </SheetContent>
                              </Sheet>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredDeliveries.length === 0 && (
                    <div className="text-center py-10">
                      <CheckCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Completed Deliveries</h3>
                      <p className="text-muted-foreground">
                        You haven't completed any deliveries in this period.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="delivery-detail" className="space-y-4">
            {selectedDelivery && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Delivery {selectedDelivery.orderNumber}
                        {getStatusBadge(selectedDelivery.status)}
                      </CardTitle>
                      <CardDescription>
                        {selectedDelivery.status === 'delivered' ? 
                          `Delivered on ${formatDateTime(selectedDelivery.actualDelivery)}` : 
                          `Expected by ${formatDateTime(selectedDelivery.estimatedDelivery)}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setActiveTab('upcoming')}>
                        Back to Deliveries
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Customer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarFallback>{selectedDelivery.customer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedDelivery.customer.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedDelivery.customer.email}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{selectedDelivery.customer.phone}</span>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Delivery Location</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <p className="font-medium">Address:</p>
                            <Badge>{selectedDelivery.shippingMethod}</Badge>
                          </div>
                          <p className="text-sm">
                            {selectedDelivery.address.street}<br />
                            {selectedDelivery.address.city}, {selectedDelivery.address.postalCode}
                          </p>
                          <div className="h-24 bg-muted rounded-md flex items-center justify-center">
                            <MapPinned className="h-6 w-6 text-muted-foreground" />
                            <span className="ml-2 text-sm text-muted-foreground">Map view</span>
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={() => handleStartNavigation(selectedDelivery)}
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            Navigate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Delivery Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">Status:</p>
                            {getStatusBadge(selectedDelivery.status)}
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm text-muted-foreground">Tracking ID:</p>
                            <p className="text-sm font-mono">{selectedDelivery.trackingId}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm text-muted-foreground">Distance:</p>
                            <p className="text-sm">{selectedDelivery.distance} km</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm text-muted-foreground">Assigned:</p>
                            <p className="text-sm">{formatDateTime(selectedDelivery.assignedAt)}</p>
                          </div>
                          {selectedDelivery.pickedUpAt && (
                            <div className="flex justify-between">
                              <p className="text-sm text-muted-foreground">Picked up:</p>
                              <p className="text-sm">{formatDateTime(selectedDelivery.pickedUpAt)}</p>
                            </div>
                          )}
                          {selectedDelivery.actualDelivery && (
                            <div className="flex justify-between">
                              <p className="text-sm text-muted-foreground">Delivered:</p>
                              <p className="text-sm">{formatDateTime(selectedDelivery.actualDelivery)}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Package Items</h3>
                    <Card>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedDelivery.items.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={handleScanBarcode} disabled={isScanningBarcode}>
                                  {isScanningBarcode ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Barcode className="h-4 w-4" />
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                  
                  {selectedDelivery.status === 'intransit' && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Delivery Confirmation</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Delivery Photo</Label>
                                <div className="aspect-video bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                                  {isCapturingPhoto ? (
                                    <div className="flex flex-col items-center justify-center gap-2">
                                      <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                                      <p className="text-sm text-muted-foreground">Capturing...</p>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center gap-2" onClick={handleCaptureDeliveryPhoto}>
                                      <Camera className="h-8 w-8 text-muted-foreground" />
                                      <p className="text-sm text-muted-foreground">Click to capture photo</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Customer Signature</Label>
                                <div className="aspect-video bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                                  <PenSquare className="h-8 w-8 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground mt-2">Tap to collect signature</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Delivery Notes</Label>
                              <Textarea 
                                placeholder="Add any notes about the delivery..."
                                value={deliveryNote}
                                onChange={(e) => setDeliveryNote(e.target.value)}
                              />
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                              <Button 
                                variant="outline" 
                                onClick={() => handleStatusChange(selectedDelivery.id, 'failed')}
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Mark as Failed
                              </Button>
                              
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  onClick={handleSubmitDeliveryNote}
                                  disabled={!deliveryNote.trim()}
                                >
                                  Save Notes
                                </Button>
                                <Button 
                                  onClick={() => handleStatusChange(selectedDelivery.id, 'delivered')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Complete Delivery
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {selectedDelivery.notes && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Special Instructions</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="bg-yellow-500/10 p-3 rounded-md flex gap-2 items-start">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <p>{selectedDelivery.notes}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('upcoming')}>
                    Back to Deliveries
                  </Button>
                  
                  {selectedDelivery.status === 'ready' && (
                    <Button onClick={() => handleStatusChange(selectedDelivery.id, 'assigned')}>
                      <PackageIcon className="h-4 w-4 mr-2" />
                      Pick Up Package
                    </Button>
                  )}
                  
                  {selectedDelivery.status === 'assigned' && (
                    <Button onClick={() => handleStatusChange(selectedDelivery.id, 'intransit')}>
                      <Truck className="h-4 w-4 mr-2" />
                      Start Delivery
                    </Button>
                  )}
                  
                  {selectedDelivery.status === 'intransit' && (
                    <Button onClick={() => handleStatusChange(selectedDelivery.id, 'delivered')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Delivery
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </StaffLayout>
  );
};

export default DeliveryStaff;
