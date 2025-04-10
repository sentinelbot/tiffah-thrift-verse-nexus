
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  PrinterIcon, 
  Package, 
  CheckCircle, 
  Search, 
  Loader2, 
  Truck, 
  CameraIcon,
  ChevronLeft,
  ClipboardList
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

const OrderDetail = ({ order, onBack }: { order: any, onBack: () => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  
  const handlePrintReceipt = () => {
    toast.info("Printing receipt...");
    setTimeout(() => {
      toast.success("Receipt printed successfully!");
    }, 1500);
  };
  
  const handleScanBarcode = () => {
    setIsScanning(true);
    
    // Simulate barcode scanning
    setTimeout(() => {
      const productId = `prod-00${Math.floor(Math.random() * 9) + 1}`;
      if (!scannedItems.includes(productId)) {
        setScannedItems([...scannedItems, productId]);
        toast.success(`Item ${productId} scanned successfully!`);
      } else {
        toast.error(`Item ${productId} already scanned`);
      }
      setIsScanning(false);
    }, 1500);
  };
  
  const handleStartProcessing = () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Order status updated to 'Processing'");
      setIsProcessing(false);
      // In a real app, you would update the order status
    }, 1500);
  };
  
  const handleMarkReady = () => {
    if (scannedItems.length < order.items.length) {
      toast.error(`Please scan all items first (${scannedItems.length}/${order.items.length})`);
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Order status updated to 'Ready for Pickup'");
      setIsProcessing(false);
      // In a real app, you would update the order status
    }, 1500);
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
          Back to Orders
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                Order #{order.id}
                <Badge className="ml-3 bg-blue-500">Processing</Badge>
              </CardTitle>
              <CardDescription>Placed {order.placedTime}</CardDescription>
            </div>
            <Button onClick={handlePrintReceipt}>
              <PrinterIcon className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Items ({order.items.length})</h3>
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => {
                  const isScanned = scannedItems.includes(item.id);
                  
                  return (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center border-b pb-4 ${isScanned ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 bg-muted rounded overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium flex items-center">
                            {item.name}
                            {isScanned && (
                              <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">{item.variant}</p>
                          <p className="text-xs mt-1">
                            <Badge variant="outline" size="sm">
                              {item.id}
                            </Badge>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p>Qty: {item.quantity}</p>
                        <p className="font-medium">KSh {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <p className="text-sm">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
              </div>
              <div className="text-right">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p className="text-sm">{order.shipping.address}</p>
                <p className="text-sm text-muted-foreground">{order.shipping.city}, {order.shipping.state}</p>
                <p className="text-sm text-muted-foreground">{order.shipping.postalCode}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium mb-2">Payment Information</h3>
                <p className="text-sm">{order.payment.method}</p>
                <p className="text-sm text-muted-foreground">Transaction ID: {order.payment.transactionId}</p>
                <Badge variant="outline" className="mt-1">{order.payment.status}</Badge>
              </div>
              <div className="text-right">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="flex justify-between gap-8">
                  <p className="text-sm">Subtotal:</p>
                  <p className="text-sm">KSh {order.subtotal.toLocaleString()}</p>
                </div>
                <div className="flex justify-between gap-8">
                  <p className="text-sm">Shipping:</p>
                  <p className="text-sm">KSh {order.shipping.cost.toLocaleString()}</p>
                </div>
                <div className="flex justify-between gap-8 font-bold mt-1">
                  <p>Total:</p>
                  <p>KSh {order.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-4 mt-2">
              <Button 
                variant="outline" 
                onClick={handleScanBarcode}
                disabled={isScanning}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <CameraIcon className="mr-2 h-4 w-4" />
                    Scan Items ({scannedItems.length}/{order.items.length})
                  </>
                )}
              </Button>
              
              {order.status === 'pending' ? (
                <Button 
                  onClick={handleStartProcessing}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Start Processing
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleMarkReady}
                  disabled={isProcessing || scannedItems.length < order.items.length}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Package className="mr-2 h-4 w-4" />
                      Mark as Ready
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const OrderPreparer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  
  // Mock orders
  const mockOrders = {
    pending: [
      {
        id: "TTS-20250407-0001",
        customer: { 
          name: "Jane Doe", 
          email: "jane.doe@example.com", 
          phone: "+254 712 345 678" 
        },
        items: [
          { 
            id: "prod-001", 
            name: "Vintage Denim Jacket", 
            variant: "Size: M • Blue", 
            price: 4500, 
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=150&auto=format&fit=crop"
          },
          {
            id: "prod-002",
            name: "Floral Summer Dress",
            variant: "Size: S • Floral",
            price: 2850,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1542295669297-4d352b042bca?q=80&w=150&auto=format&fit=crop"
          },
          {
            id: "prod-003",
            name: "Leather Crossbody Bag",
            variant: "Brown",
            price: 3499,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=150&auto=format&fit=crop"
          }
        ],
        subtotal: 10849,
        shipping: { 
          address: "123 Mombasa Road", 
          city: "Nairobi",
          state: "Nairobi",
          postalCode: "00100",
          cost: 300
        },
        payment: { 
          method: "M-Pesa", 
          transactionId: "MPE123456789", 
          status: "Paid" 
        },
        total: 11149,
        status: "pending",
        placedTime: "20 minutes ago"
      },
      {
        id: "TTS-20250407-0002",
        customer: { 
          name: "John Smith", 
          email: "john.smith@example.com", 
          phone: "+254 723 456 789" 
        },
        items: [
          { 
            id: "prod-004", 
            name: "Vintage T-Shirt", 
            variant: "Size: L • Black", 
            price: 1800, 
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=150&auto=format&fit=crop"
          },
          {
            id: "prod-005",
            name: "Leather Belt",
            variant: "Brown",
            price: 1200,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=150&auto=format&fit=crop"
          }
        ],
        subtotal: 3000,
        shipping: { 
          address: "456 Ngong Road", 
          city: "Nairobi",
          state: "Nairobi",
          postalCode: "00100",
          cost: 300
        },
        payment: { 
          method: "Card", 
          transactionId: "CARD987654321", 
          status: "Paid" 
        },
        total: 3300,
        status: "pending",
        placedTime: "45 minutes ago"
      }
    ],
    processing: [
      {
        id: "TTS-20250407-0003",
        customer: { 
          name: "Alice Johnson", 
          email: "alice@example.com", 
          phone: "+254 734 567 890" 
        },
        items: [
          { 
            id: "prod-006", 
            name: "Silk Scarf", 
            variant: "Pattern: Paisley", 
            price: 1500, 
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1588760297189-2cf9ecef753a?q=80&w=150&auto=format&fit=crop"
          }
        ],
        subtotal: 1500,
        shipping: { 
          address: "789 Kiambu Road", 
          city: "Nairobi",
          state: "Nairobi",
          postalCode: "00200",
          cost: 300
        },
        payment: { 
          method: "M-Pesa", 
          transactionId: "MPE987654321", 
          status: "Paid" 
        },
        total: 1800,
        status: "processing",
        placedTime: "2 hours ago"
      }
    ],
    ready: [
      {
        id: "TTS-20250406-0001",
        customer: { 
          name: "Bob Williams", 
          email: "bob@example.com", 
          phone: "+254 745 678 901" 
        },
        items: [
          { 
            id: "prod-007", 
            name: "Wool Sweater", 
            variant: "Size: XL • Gray", 
            price: 3200, 
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1599782146201-c786c5a5cb4d?q=80&w=150&auto=format&fit=crop"
          },
          { 
            id: "prod-008", 
            name: "Winter Gloves", 
            variant: "Size: M • Black", 
            price: 850, 
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1545194779-2f3db9194797?q=80&w=150&auto=format&fit=crop"
          }
        ],
        subtotal: 4050,
        shipping: { 
          address: "101 Thika Road", 
          city: "Nairobi",
          state: "Nairobi",
          postalCode: "00300",
          cost: 300
        },
        payment: { 
          method: "Card", 
          transactionId: "CARD123498765", 
          status: "Paid" 
        },
        total: 4350,
        status: "ready",
        placedTime: "yesterday"
      }
    ]
  };

  const handlePrintReceipt = () => {
    setIsLoading(true);
    
    // Simulate printing process
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Receipt printed successfully!");
    }, 1500);
  };
  
  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
  };

  if (selectedOrder) {
    return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Preparation</h1>
      
      <Tabs defaultValue="pending" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending">
            Pending Orders
            <Badge variant="outline" className="ml-2">{mockOrders.pending.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="processing">
            Processing
            <Badge variant="outline" className="ml-2">{mockOrders.processing.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="ready">
            Ready for Pickup
            <Badge variant="outline" className="ml-2">{mockOrders.ready.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
          </TabsTrigger>
        </TabsList>
        
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-8" />
        </div>
        
        <TabsContent value="pending" className="space-y-6">
          {mockOrders.pending.map((order) => (
            <Card key={order.id} className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => handleOrderClick(order)}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      Order #{order.id}
                      <Badge className="ml-3 bg-yellow-500">Pending</Badge>
                    </CardTitle>
                    <CardDescription>Placed {order.placedTime}</CardDescription>
                  </div>
                  <Button variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    handlePrintReceipt();
                  }}>
                    <PrinterIcon className="mr-2 h-4 w-4" />
                    Print Receipt
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-muted rounded overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{order.customer.name}</span> • {order.customer.phone}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.payment.method} • {order.payment.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">KSh {order.total.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <Button onClick={(e) => {
                      e.stopPropagation();
                      toast.success("Order status updated to 'Processing'");
                    }}>
                      <Package className="mr-2 h-4 w-4" />
                      Start Processing
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="processing">
          {mockOrders.processing.map((order) => (
            <Card key={order.id} className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => handleOrderClick(order)}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      Order #{order.id}
                      <Badge className="ml-3 bg-blue-500">Processing</Badge>
                    </CardTitle>
                    <CardDescription>Placed {order.placedTime}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {order.items.length} items • KSh {order.total.toLocaleString()} • {order.payment.method}
                </p>
                <div className="flex justify-end">
                  <Button>
                    <CameraIcon className="mr-2 h-4 w-4" />
                    Scan Items
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="ready">
          {mockOrders.ready.map((order) => (
            <Card key={order.id} className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => handleOrderClick(order)}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      Order #{order.id}
                      <Badge className="ml-3 bg-purple-500">Ready</Badge>
                    </CardTitle>
                    <CardDescription>Placed {order.placedTime}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {order.items.length} items • KSh {order.total.toLocaleString()} • {order.payment.method}
                </p>
                <div className="flex justify-end">
                  <Button>
                    <Truck className="mr-2 h-4 w-4" />
                    Assign for Delivery
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Completed orders will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderPreparer;
