
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreVertical, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  MapIcon,
  Camera,
  PenSquare,
  CheckCircle2,
  Eye,
  ScrollText,
  Ban,
  PackageCheck,
  PackageOpen,
  Send,
  Image,
  AlertTriangle,
  Printer,
  MapPinned,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock deliveries data
const mockDeliveries = [
  {
    id: 'del-001',
    orderNumber: 'TTS-20250410-0001',
    customer: 'John Doe',
    address: '123 Moi Avenue, Nairobi',
    phone: '+254712345678',
    items: 3,
    status: 'assigned',
    estimatedDelivery: new Date(Date.now() + 3600000 * 3).toISOString(),
    assignedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'del-002',
    orderNumber: 'TTS-20250410-0002',
    customer: 'Jane Smith',
    address: '456 Kenyatta Road, Nairobi',
    phone: '+254723456789',
    items: 1,
    status: 'inProgress',
    estimatedDelivery: new Date(Date.now() + 3600000 * 1).toISOString(),
    assignedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'del-003',
    orderNumber: 'TTS-20250409-0003',
    customer: 'Robert Johnson',
    address: '789 Uhuru Highway, Nairobi',
    phone: '+254734567890',
    items: 2,
    status: 'completed',
    estimatedDelivery: new Date(Date.now() - 3600000 * 2).toISOString(),
    assignedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    deliveredAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'del-004',
    orderNumber: 'TTS-20250409-0004',
    customer: 'Maria Garcia',
    address: '101 Thika Road, Nairobi',
    phone: '+254745678901',
    items: 4,
    status: 'failed',
    estimatedDelivery: new Date(Date.now() - 3600000 * 5).toISOString(),
    assignedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    failureReason: 'Customer was not available at the delivery address',
  },
];

// Mock route orders for today
const mockRouteOrders = [
  {
    id: 'del-001',
    orderNumber: 'TTS-20250410-0001',
    customer: 'John Doe',
    address: '123 Moi Avenue, Nairobi',
    deliveryTime: '10:00 AM - 12:00 PM',
    status: 'assigned',
    distance: '2.5 km',
  },
  {
    id: 'del-002',
    orderNumber: 'TTS-20250410-0002',
    customer: 'Jane Smith',
    address: '456 Kenyatta Road, Nairobi',
    deliveryTime: '12:30 PM - 2:30 PM',
    status: 'inProgress',
    distance: '4.1 km',
  },
  {
    id: 'del-005',
    orderNumber: 'TTS-20250410-0005',
    customer: 'Michael Brown',
    address: '202 Ngong Road, Nairobi',
    deliveryTime: '3:00 PM - 5:00 PM',
    status: 'assigned',
    distance: '5.7 km',
  },
];

const DeliveryStaff = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('today');
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [isRecordingDelivery, setIsRecordingDelivery] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Searching for: ${searchQuery}`);
  };
  
  const handleViewDelivery = (delivery: any) => {
    setSelectedDelivery(delivery);
  };
  
  const handleStartDelivery = (deliveryId: string) => {
    toast.success(`Started delivery for ${deliveryId}`);
  };
  
  const handleRecordDelivery = (delivery: any) => {
    setSelectedDelivery(delivery);
    setIsRecordingDelivery(true);
  };
  
  const handleCapturePhoto = () => {
    setIsCapturingPhoto(true);
    
    // Simulate photo capture
    setTimeout(() => {
      setIsCapturingPhoto(false);
      toast.success('Delivery photo captured');
    }, 2000);
  };
  
  const handleConfirmDelivery = () => {
    toast.success(`Delivery confirmed for order ${selectedDelivery?.orderNumber}`);
    setIsRecordingDelivery(false);
    setSelectedDelivery(null);
  };
  
  const handleCallCustomer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };
  
  const handleNavigateToMap = (address: string) => {
    // In a real app, this would open a navigation app with the address
    toast.info(`Navigating to: ${address}`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600">Assigned</Badge>;
      case 'inProgress':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-600">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/20 text-green-600">Completed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-500/20 text-red-600">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredDeliveries = activeTab === 'today' 
    ? mockRouteOrders 
    : mockDeliveries.filter(delivery => {
        if (activeTab === 'all') return true;
        if (activeTab === 'assigned') return delivery.status === 'assigned';
        if (activeTab === 'inProgress') return delivery.status === 'inProgress';
        if (activeTab === 'completed') return delivery.status === 'completed';
        if (activeTab === 'failed') return delivery.status === 'failed';
        return true;
      }).filter(delivery => 
        delivery.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.address.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Delivery Management</h1>
          <p className="text-muted-foreground">Manage and track your deliveries</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button>
            <Truck className="mr-2 h-4 w-4" />
            Start Route
          </Button>
          <Button variant="outline">
            <MapIcon className="mr-2 h-4 w-4" />
            View Map
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">3</CardTitle>
            <CardDescription>Today's Deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">1</span> in progress
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">2</CardTitle>
            <CardDescription>Pending Deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Assigned to you
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">15</CardTitle>
            <CardDescription>Completed Deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              This week
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">12.4 km</CardTitle>
            <CardDescription>Today's Route</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Estimated time: 1h 45m
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="today">Today's Route</TabsTrigger>
            <TabsTrigger value="all">All Deliveries</TabsTrigger>
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 sm:flex-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search deliveries..." 
                className="pl-9 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="today" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle>Today's Delivery Route</CardTitle>
              <CardDescription>
                Optimized route for today's deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockRouteOrders.map((delivery, index) => (
                  <div key={delivery.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      {index < mockRouteOrders.length - 1 && (
                        <div className="h-full w-0.5 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 border rounded-lg p-4 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{delivery.orderNumber}</h3>
                            <span className="mx-2">•</span>
                            <span className="text-sm">{delivery.customer}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{delivery.address}</span>
                            <span className="mx-2">•</span>
                            <span>{delivery.distance}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(delivery.status)}
                          <span className="text-sm">{delivery.deliveryTime}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant={delivery.status === 'inProgress' ? 'default' : 'outline'}
                          className={delivery.status === 'inProgress' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                          onClick={() => delivery.status === 'assigned' && handleStartDelivery(delivery.id)}
                        >
                          {delivery.status === 'inProgress' ? (
                            <>
                              <PackageCheck className="mr-2 h-4 w-4" />
                              Mark Delivered
                            </>
                          ) : (
                            <>
                              <Truck className="mr-2 h-4 w-4" />
                              Start Delivery
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleNavigateToMap(delivery.address)}>
                          <MapIcon className="mr-2 h-4 w-4" />
                          Navigate
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleCallCustomer('+254712345678')}>
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleViewDelivery(delivery)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <div className="text-sm text-muted-foreground">
                Total distance: 12.4 km • Estimated time: 1h 45m
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value={activeTab !== 'today' ? activeTab : ''} className="m-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Est. Delivery
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeliveries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center">
                          <Truck className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground mb-2">No deliveries found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.orderNumber}</TableCell>
                        <TableCell>{delivery.customer}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{delivery.address}</TableCell>
                        <TableCell>{delivery.items || '-'}</TableCell>
                        <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                        <TableCell>
                          {delivery.estimatedDelivery ? 
                            new Date(delivery.estimatedDelivery).toLocaleString() : 
                            delivery.deliveryTime || '-'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewDelivery(delivery)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {delivery.status === 'assigned' && (
                                <DropdownMenuItem onClick={() => handleStartDelivery(delivery.id)}>
                                  <Truck className="mr-2 h-4 w-4" />
                                  Start Delivery
                                </DropdownMenuItem>
                              )}
                              {delivery.status === 'inProgress' && (
                                <DropdownMenuItem onClick={() => handleRecordDelivery(delivery)}>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Record Delivery
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleNavigateToMap(delivery.address)}>
                                <MapIcon className="mr-2 h-4 w-4" />
                                Navigate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCallCustomer(delivery.phone || '+254712345678')}>
                                <Phone className="mr-2 h-4 w-4" />
                                Call Customer
                              </DropdownMenuItem>
                              {(delivery.status === 'assigned' || delivery.status === 'inProgress') && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <Ban className="mr-2 h-4 w-4" />
                                    Report Issue
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{filteredDeliveries.length}</span> deliveries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delivery Details Dialog */}
      <Dialog open={selectedDelivery !== null && !isRecordingDelivery} onOpenChange={(open) => !open && setSelectedDelivery(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
            <DialogDescription>
              {selectedDelivery && (
                <span>Order #{selectedDelivery.orderNumber}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDelivery && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                  <div>{getStatusBadge(selectedDelivery.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Items</h4>
                  <p className="text-sm">{selectedDelivery.items || '-'} items</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Customer</h4>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-muted-foreground" />
                    <p className="text-sm">{selectedDelivery.customer}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Address</h4>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm">{selectedDelivery.address}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact</h4>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                    <p className="text-sm">{selectedDelivery.phone || '+254712345678'}</p>
                  </div>
                </div>
              </div>
              
              {selectedDelivery.status === 'failed' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-700 mb-1">Delivery Failed</h4>
                      <p className="text-sm text-red-600">{selectedDelivery.failureReason}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedDelivery.status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-700 mb-1">Delivery Completed</h4>
                      <p className="text-sm text-green-600">
                        Delivered on {new Date(selectedDelivery.deliveredAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between border-t pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="font-medium">
                    {selectedDelivery.estimatedDelivery ? 
                      new Date(selectedDelivery.estimatedDelivery).toLocaleString() : 
                      selectedDelivery.deliveryTime || 'Not scheduled'
                    }
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="font-medium">{selectedDelivery.distance || '~3.5 km'}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleNavigateToMap(selectedDelivery?.address)}
              >
                <MapIcon className="mr-2 h-4 w-4" />
                Navigate
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleCallCustomer(selectedDelivery?.phone || '+254712345678')}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call
              </Button>
            </div>
            
            {selectedDelivery?.status === 'assigned' && (
              <Button size="sm" onClick={() => {
                handleStartDelivery(selectedDelivery.id);
                setSelectedDelivery(null);
              }}>
                <Truck className="mr-2 h-4 w-4" />
                Start Delivery
              </Button>
            )}
            
            {selectedDelivery?.status === 'inProgress' && (
              <Button size="sm" onClick={() => {
                setIsRecordingDelivery(true);
              }}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Record Delivery
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Record Delivery Dialog */}
      <Dialog open={isRecordingDelivery} onOpenChange={(open) => !open && setIsRecordingDelivery(false)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Record Delivery</DialogTitle>
            <DialogDescription>
              {selectedDelivery && (
                <span>Complete delivery for order #{selectedDelivery.orderNumber}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Delivery Checklist</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <span>Package is in good condition</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <span>Correct customer information verified</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <span>All items included in package</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Delivery Photo</h3>
              {isCapturingPhoto ? (
                <div className="border rounded-md p-8 text-center">
                  <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">Capturing photo...</p>
                </div>
              ) : (
                <div className="border rounded-md p-8 text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm mb-4">Take a photo as proof of delivery</p>
                  <Button onClick={handleCapturePhoto}>
                    <Image className="mr-2 h-4 w-4" />
                    Capture Photo
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Delivery Notes</h3>
              <textarea
                placeholder="Add any notes about the delivery (optional)"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecordingDelivery(false)}>
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleConfirmDelivery}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirm Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryStaff;
