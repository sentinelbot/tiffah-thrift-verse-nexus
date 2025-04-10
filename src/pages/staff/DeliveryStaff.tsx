
import React, { useState } from 'react';
import StaffLayout from '@/components/layout/StaffLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Truck,
  PackageCheck,
  Clock,
  MapPin,
  Phone,
  User,
  Search,
  Filter,
  ChevronRight,
  Camera,
  Calendar,
  CheckCircle2,
  AlertCircle,
  MailOpen,
  Route,
} from 'lucide-react';

const DeliveryStaff = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [showDeliveryDetail, setShowDeliveryDetail] = useState(false);
  const [deliveryConfirmationOpen, setDeliveryConfirmationOpen] = useState(false);
  
  // Mock delivery data
  const deliveries = [
    {
      id: 'DEL-0015',
      orderId: 'ORD-20250410-1582',
      customer: {
        name: 'Amina Wanjiku',
        phone: '+254734567890',
        email: 'amina.w@example.com',
      },
      address: {
        street: '742 Kimathi Avenue',
        neighborhood: 'Westlands',
        city: 'Nairobi',
        instructions: 'Green gate, apartment building on the right.'
      },
      items: [
        {
          id: 'ITEM-005',
          name: 'Wool Winter Coat',
          price: 4500,
          quantity: 1
        },
        {
          id: 'ITEM-006',
          name: 'Vintage Graphic T-Shirt',
          price: 1200,
          quantity: 2
        }
      ],
      status: 'ready',
      priority: 'high',
      scheduledDate: '2025-04-11 10:00',
      distance: 5.2,
      estimatedTime: 25,
    },
    {
      id: 'DEL-0014',
      orderId: 'ORD-20250409-1581',
      customer: {
        name: 'David Omondi',
        phone: '+254745678901',
        email: 'david.o@example.com',
      },
      address: {
        street: '123 Moi Avenue',
        neighborhood: 'CBD',
        city: 'Nairobi',
        instructions: 'Office building, 5th floor, Suite 503'
      },
      items: [
        {
          id: 'ITEM-007',
          name: 'High-Waisted Jeans',
          price: 1900,
          quantity: 1
        },
        {
          id: 'ITEM-008',
          name: 'Cashmere Sweater',
          price: 3800,
          quantity: 1
        }
      ],
      status: 'outForDelivery',
      priority: 'medium',
      scheduledDate: '2025-04-10 14:30',
      distance: 2.8,
      estimatedTime: 15,
    },
    {
      id: 'DEL-0013',
      orderId: 'ORD-20250409-1580',
      customer: {
        name: 'Lucy Mwangi',
        phone: '+254756789012',
        email: 'lucy.m@example.com',
      },
      address: {
        street: '87 Garden Estate Road',
        neighborhood: 'Ridgeways',
        city: 'Nairobi',
        instructions: 'White house with blue fence'
      },
      items: [
        {
          id: 'ITEM-009',
          name: 'Silk Blouse',
          price: 2200,
          quantity: 1
        },
        {
          id: 'ITEM-010',
          name: 'Leather Belt',
          price: 850,
          quantity: 1
        }
      ],
      status: 'delivered',
      priority: 'medium',
      scheduledDate: '2025-04-09 16:00',
      completedDate: '2025-04-09 16:35',
      distance: 8.5,
      estimatedTime: 40,
    },
    {
      id: 'DEL-0012',
      orderId: 'ORD-20250408-1579',
      customer: {
        name: 'James Kariuki',
        phone: '+254767890123',
        email: 'james.k@example.com',
      },
      address: {
        street: '45 Lenana Road',
        neighborhood: 'Kilimani',
        city: 'Nairobi',
        instructions: 'Apartment complex, Unit 12B'
      },
      items: [
        {
          id: 'ITEM-011',
          name: 'Leather Jacket',
          price: 5500,
          quantity: 1
        }
      ],
      status: 'delivered',
      priority: 'low',
      scheduledDate: '2025-04-08 12:00',
      completedDate: '2025-04-08 12:45',
      distance: 3.2,
      estimatedTime: 20,
    },
    {
      id: 'DEL-0011',
      orderId: 'ORD-20250408-1578',
      customer: {
        name: 'Grace Nyambura',
        phone: '+254778901234',
        email: 'grace.n@example.com',
      },
      address: {
        street: '28 Ngong Road',
        neighborhood: 'Ngong',
        city: 'Nairobi',
        instructions: 'Next to Prestige Mall'
      },
      items: [
        {
          id: 'ITEM-012',
          name: 'Summer Dress',
          price: 1800,
          quantity: 1
        },
        {
          id: 'ITEM-013',
          name: 'Sun Hat',
          price: 750,
          quantity: 1
        },
        {
          id: 'ITEM-014',
          name: 'Sunglasses',
          price: 1200,
          quantity: 1
        }
      ],
      status: 'delivered',
      priority: 'high',
      scheduledDate: '2025-04-08 09:00',
      completedDate: '2025-04-08 09:30',
      distance: 12.5,
      estimatedTime: 55,
    },
  ];
  
  // Filter deliveries based on search query
  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    delivery.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    delivery.address.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
    delivery.address.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ready':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Ready</Badge>;
      case 'outForDelivery':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Delivered</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Handle delivery status update
  const updateDeliveryStatus = (deliveryId: string, newStatus: string) => {
    // In a real app, this would update the database
    toast.success(`Delivery ${deliveryId} status updated to ${newStatus}`);
    setShowDeliveryDetail(false);
  };
  
  // Calculate total items
  const getTotalItems = (items: any[]) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  
  // Calculate total amount
  const getTotalAmount = (items: any[]) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Handle delivery confirmation
  const confirmDelivery = () => {
    if (selectedDelivery) {
      updateDeliveryStatus(selectedDelivery.id, 'delivered');
      setDeliveryConfirmationOpen(false);
      
      toast.success('Delivery confirmed successfully');
    }
  };
  
  return (
    <StaffLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold">Delivery Management</h1>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deliveries..."
                  className="pl-8 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              
              <Button variant="outline">
                <Route className="h-4 w-4 mr-2" />
                Optimize Route
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="upcoming" className="mb-6">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Deliveries</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Upcoming Deliveries</CardTitle>
                  </div>
                  <CardDescription>Deliveries that are ready to be picked up</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    {filteredDeliveries.filter(d => d.status === 'ready').length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                        <CheckCircle2 className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground mb-2">No upcoming deliveries</p>
                        <p className="text-sm text-muted-foreground">All deliveries have been picked up or delivered</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDeliveries
                          .filter(delivery => delivery.status === 'ready')
                          .map((delivery) => (
                            <Card key={delivery.id} className="overflow-hidden h-full">
                              <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-base">{delivery.customer.name}</CardTitle>
                                    <CardDescription>{delivery.orderId}</CardDescription>
                                  </div>
                                  {getPriorityBadge(delivery.priority)}
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-2 pb-0">
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-sm">{delivery.address.street}</p>
                                      <p className="text-sm text-muted-foreground">{delivery.address.neighborhood}, {delivery.address.city}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <PackageCheck className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <p className="text-sm">{getTotalItems(delivery.items)} items (KSh {getTotalAmount(delivery.items).toLocaleString()})</p>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <p className="text-sm">{formatDate(delivery.scheduledDate)}</p>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <p className="text-sm">{delivery.distance} km ({delivery.estimatedTime} mins)</p>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="p-4">
                                <Button
                                  className="w-full"
                                  onClick={() => {
                                    setSelectedDelivery(delivery);
                                    setShowDeliveryDetail(true);
                                  }}
                                >
                                  <Truck className="h-4 w-4 mr-2" />
                                  Start Delivery
                                </Button>
                              </CardFooter>
                            </Card>
                          ))
                        }
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inProgress">
              <Card>
                <CardHeader>
                  <CardTitle>In Progress Deliveries</CardTitle>
                  <CardDescription>Deliveries that are currently being delivered</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDeliveries
                      .filter(delivery => delivery.status === 'outForDelivery')
                      .map((delivery) => (
                        <Card key={delivery.id} className="overflow-hidden h-full border-blue-200 dark:border-blue-800">
                          <CardHeader className="p-4 pb-2 bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">{delivery.customer.name}</CardTitle>
                                <CardDescription>{delivery.orderId}</CardDescription>
                              </div>
                              {getStatusBadge(delivery.status)}
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-2 pb-0">
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm">{delivery.address.street}</p>
                                  <p className="text-sm text-muted-foreground">{delivery.address.neighborhood}, {delivery.address.city}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <PackageCheck className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <p className="text-sm">{getTotalItems(delivery.items)} items (KSh {getTotalAmount(delivery.items).toLocaleString()})</p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <p className="text-sm">{delivery.customer.phone}</p>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4">
                            <Button
                              className="w-full"
                              variant="outline"
                              onClick={() => {
                                setSelectedDelivery(delivery);
                                setDeliveryConfirmationOpen(true);
                              }}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Complete Delivery
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="completed">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Deliveries</CardTitle>
                  <CardDescription>Deliveries that have been successfully delivered</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDeliveries
                      .filter(delivery => delivery.status === 'delivered')
                      .map((delivery) => (
                        <Card key={delivery.id} className="overflow-hidden h-full">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">{delivery.customer.name}</CardTitle>
                                <CardDescription>{delivery.orderId}</CardDescription>
                              </div>
                              {getStatusBadge(delivery.status)}
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-2 pb-0">
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm">{delivery.address.street}</p>
                                  <p className="text-sm text-muted-foreground">{delivery.address.neighborhood}, {delivery.address.city}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <p className="text-sm">Delivered: {formatDate(delivery.completedDate)}</p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <PackageCheck className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <p className="text-sm">{getTotalItems(delivery.items)} items (KSh {getTotalAmount(delivery.items).toLocaleString()})</p>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4">
                            <Button
                              className="w-full"
                              variant="outline"
                              onClick={() => {
                                setSelectedDelivery(delivery);
                                setShowDeliveryDetail(true);
                              }}
                            >
                              View Details
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Deliveries</CardTitle>
                  <CardDescription>View all deliveries regardless of status</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">All deliveries will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Delivery Detail Dialog */}
          <Dialog open={showDeliveryDetail} onOpenChange={setShowDeliveryDetail}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Delivery Details: {selectedDelivery?.id}</DialogTitle>
                <DialogDescription>
                  View and manage delivery information
                </DialogDescription>
              </DialogHeader>
              
              {selectedDelivery && (
                <div className="py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Customer Information</h3>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <p className="font-medium">{selectedDelivery.customer.name}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <p className="text-sm">{selectedDelivery.customer.phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <MailOpen className="h-3.5 w-3.5 text-muted-foreground" />
                          <p className="text-sm">{selectedDelivery.customer.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Delivery Address</h3>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <p className="text-sm font-medium">{selectedDelivery.address.street}</p>
                        <p className="text-sm">{selectedDelivery.address.neighborhood}, {selectedDelivery.address.city}</p>
                        {selectedDelivery.address.instructions && (
                          <div className="mt-2 pt-2 border-t border-muted-foreground/20">
                            <p className="text-xs font-medium">Instructions:</p>
                            <p className="text-xs text-muted-foreground">{selectedDelivery.address.instructions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Delivery Information</h3>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm">Status:</p>
                          <div>{getStatusBadge(selectedDelivery.status)}</div>
                        </div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm">Priority:</p>
                          <div>{getPriorityBadge(selectedDelivery.priority)}</div>
                        </div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm">Scheduled Date:</p>
                          <p className="text-sm">{formatDate(selectedDelivery.scheduledDate)}</p>
                        </div>
                        {selectedDelivery.completedDate && (
                          <div className="flex justify-between mb-1">
                            <p className="text-sm">Completed Date:</p>
                            <p className="text-sm">{formatDate(selectedDelivery.completedDate)}</p>
                          </div>
                        )}
                        <div className="flex justify-between mb-1">
                          <p className="text-sm">Distance:</p>
                          <p className="text-sm">{selectedDelivery.distance} km</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm">Estimated Time:</p>
                          <p className="text-sm">{selectedDelivery.estimatedTime} mins</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Order Information</h3>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm">Order ID:</p>
                          <p className="text-sm font-medium">{selectedDelivery.orderId}</p>
                        </div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm">Total Items:</p>
                          <p className="text-sm">{getTotalItems(selectedDelivery.items)}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm">Total Amount:</p>
                          <p className="text-sm font-medium">KSh {getTotalAmount(selectedDelivery.items).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-medium mb-2">Order Items</h3>
                  <div className="border rounded-md p-3 mb-4">
                    <div className="space-y-2">
                      {selectedDelivery.items.map((item: any, index: number) => (
                        <React.Fragment key={item.id}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 bg-muted rounded-md flex-shrink-0"></div>
                              <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-medium">KSh {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          {index < selectedDelivery.items.length - 1 && <Separator />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter className="flex-col sm:flex-row gap-2">
                {selectedDelivery?.status === 'ready' && (
                  <Button
                    onClick={() => updateDeliveryStatus(selectedDelivery.id, 'outForDelivery')}
                    className="flex-1"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Start Delivery
                  </Button>
                )}
                
                {selectedDelivery?.status === 'outForDelivery' && (
                  <Button
                    onClick={() => {
                      setShowDeliveryDetail(false);
                      setDeliveryConfirmationOpen(true);
                    }}
                    className="flex-1"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Complete Delivery
                  </Button>
                )}
                
                <Button variant="outline" onClick={() => setShowDeliveryDetail(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Delivery Confirmation Dialog */}
          <Dialog open={deliveryConfirmationOpen} onOpenChange={setDeliveryConfirmationOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Delivery</DialogTitle>
                <DialogDescription>
                  Complete the delivery process for order {selectedDelivery?.orderId}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">Take a photo of the delivered package</p>
                  <p className="text-xs text-muted-foreground">or tap to capture from camera</p>
                </div>
                
                <Select defaultValue="customer">
                  <SelectTrigger>
                    <SelectValue placeholder="Select who received the package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="familyMember">Family Member</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="security">Security Guard</SelectItem>
                    <SelectItem value="neighbor">Neighbor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                
                <div>
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input id="recipientName" placeholder="Enter recipient name" className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="deliveryNotes">Notes (Optional)</Label>
                  <Textarea
                    id="deliveryNotes"
                    placeholder="Add any notes about the delivery"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setDeliveryConfirmationOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmDelivery}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm Delivery
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </StaffLayout>
  );
};

export default DeliveryStaff;
