
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingBag, Barcode, Printer, Check, Package, Search, Clock } from 'lucide-react';
import OrderScanner from '@/components/barcode/OrderScanner';
import { toast } from 'sonner';
import { generateBarcodeDataURL } from '@/utils/barcodeUtils';

// Mock data for orders
const MOCK_ORDERS = [
  {
    id: 'order-001',
    orderNumber: 'TTS-20250410-0001',
    customerName: 'Jane Doe',
    status: 'processing',
    dateCreated: '2025-04-10T10:30:00Z',
    items: [
      { id: 'item-001', name: 'Vintage Denim Jacket', size: 'M', color: 'Blue', barcode: 'TTS-2BJZAV-001' },
      { id: 'item-002', name: 'Floral Summer Dress', size: 'S', color: 'Multi', barcode: 'TTS-2BJZAV-002' }
    ]
  },
  {
    id: 'order-002',
    orderNumber: 'TTS-20250410-0002',
    customerName: 'John Smith',
    status: 'pending',
    dateCreated: '2025-04-10T11:45:00Z',
    items: [
      { id: 'item-003', name: 'Leather Boots', size: '42', color: 'Brown', barcode: 'TTS-2BJZAV-003' }
    ]
  },
  {
    id: 'order-003',
    orderNumber: 'TTS-20250409-0003',
    customerName: 'Alice Johnson',
    status: 'ready',
    dateCreated: '2025-04-09T14:20:00Z',
    items: [
      { id: 'item-004', name: 'Vintage Handbag', size: 'One Size', color: 'Tan', barcode: 'TTS-2BJZAV-004' },
      { id: 'item-005', name: 'Silk Scarf', size: 'One Size', color: 'Multi', barcode: 'TTS-2BJZAV-005' },
      { id: 'item-006', name: 'Sunglasses', size: 'One Size', color: 'Black', barcode: 'TTS-2BJZAV-006' }
    ]
  }
];

const OrderPreparer = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [showScanner, setShowScanner] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [scannedItems, setScannedItems] = useState({});
  
  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (activeTab === 'pending') return order.status === 'pending';
    if (activeTab === 'processing') return order.status === 'processing';
    if (activeTab === 'ready') return order.status === 'ready';
    return true;
  });
  
  const handleScanOrder = (orderNumber) => {
    const foundOrder = MOCK_ORDERS.find(order => order.orderNumber === orderNumber);
    if (foundOrder) {
      setSelectedOrder(foundOrder);
      setShowScanner(false);
      toast.success(`Order ${orderNumber} found`);
    } else {
      toast.error(`Order ${orderNumber} not found`);
    }
  };
  
  const handleItemScan = (barcode) => {
    if (!selectedOrder) return;
    
    const itemIndex = selectedOrder.items.findIndex(item => item.barcode === barcode);
    if (itemIndex !== -1) {
      setScannedItems({
        ...scannedItems,
        [barcode]: true
      });
      toast.success(`Item verified: ${selectedOrder.items[itemIndex].name}`);
      
      // Check if all items are scanned
      const allScanned = selectedOrder.items.every(item => scannedItems[item.barcode] || item.barcode === barcode);
      if (allScanned) {
        toast.success("All items verified! Order ready for packing");
      }
    } else {
      toast.error("Item not found in this order");
    }
  };
  
  const handlePrintPackingSlip = () => {
    toast.success("Printing packing slip...");
  };
  
  const handleMarkReady = () => {
    const allScanned = selectedOrder.items.every(item => scannedItems[item.barcode]);
    if (!allScanned) {
      toast.error("Please verify all items before marking as ready");
      return;
    }
    
    toast.success(`Order ${selectedOrder.orderNumber} marked as ready for delivery`);
    setSelectedOrder(null);
    setScannedItems({});
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (showScanner) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Scan Order</h1>
        <OrderScanner 
          onBack={() => setShowScanner(false)}
          onScanComplete={handleScanOrder}
        />
      </div>
    );
  }
  
  if (selectedOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Button variant="outline" onClick={() => setSelectedOrder(null)} className="mr-4">
            Back
          </Button>
          <h1 className="text-2xl font-bold">Order {selectedOrder.orderNumber}</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              {formatDate(selectedOrder.dateCreated)} | {selectedOrder.customerName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-muted-foreground">Order Number:</span>
                <p>{selectedOrder.orderNumber}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge>{selectedOrder.status}</Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Date Created:</span>
                <p>{formatDate(selectedOrder.dateCreated)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Customer:</span>
                <p>{selectedOrder.customerName}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Items to Pack</h3>
              {selectedOrder.items.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center border p-3 rounded-md mb-2 ${
                    scannedItems[item.barcode] ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : ''
                  }`}
                >
                  <Checkbox 
                    checked={scannedItems[item.barcode] || false}
                    onCheckedChange={(checked) => {
                      setScannedItems({
                        ...scannedItems,
                        [item.barcode]: !!checked
                      });
                    }}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <div className="flex text-sm text-muted-foreground">
                      <span className="mr-3">Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleItemScan(item.barcode);
                      }}
                    >
                      <Barcode className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrintPackingSlip}>
              <Printer className="h-4 w-4 mr-2" />
              Print Packing Slip
            </Button>
            <Button onClick={handleMarkReady}>
              <Check className="h-4 w-4 mr-2" />
              Mark as Ready
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Preparation</h1>
        <Button onClick={() => setShowScanner(true)}>
          <Barcode className="h-4 w-4 mr-2" />
          Scan Order
        </Button>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search orders..." className="pl-10" />
        </div>
      </div>
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 grid grid-cols-3 w-full">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center p-8">
                <p className="text-muted-foreground">No orders found in this category</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedOrder(order)}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                    <Badge>{order.status}</Badge>
                  </div>
                  <CardDescription>{order.customerName}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDate(order.dateCreated)}
                  </div>
                  <div className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    <span>{order.items.length} items</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline" className="w-full">Process Order</Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderPreparer;
