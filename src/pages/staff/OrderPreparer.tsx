
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PrinterIcon, Package, CheckCircle, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const OrderPreparer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  const handlePrintReceipt = () => {
    setIsLoading(true);
    
    // Simulate printing process
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Receipt printed successfully!");
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Preparation</h1>
      
      <Tabs defaultValue="pending" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending">
            Pending Orders
            <Badge variant="outline" className="ml-2">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="processing">
            Processing
            <Badge variant="outline" className="ml-2">1</Badge>
          </TabsTrigger>
          <TabsTrigger value="ready">
            Ready for Pickup
            <Badge variant="outline" className="ml-2">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    Order #TTS-20250407-0001
                    <Badge className="ml-3">Pending</Badge>
                  </CardTitle>
                  <CardDescription>Placed 20 minutes ago</CardDescription>
                </div>
                <Button onClick={handlePrintReceipt} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Printing...
                    </>
                  ) : (
                    <>
                      <PrinterIcon className="mr-2 h-4 w-4" />
                      Print Receipt
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Items (3)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-muted rounded overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=150&auto=format&fit=crop" 
                            alt="Vintage Denim Jacket" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">Vintage Denim Jacket</p>
                          <p className="text-sm text-muted-foreground">Size: M • Blue</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p>Qty: 1</p>
                        <p className="font-medium">KSh 4,500</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-b pb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-muted rounded overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1542295669297-4d352b042bca?q=80&w=150&auto=format&fit=crop" 
                            alt="Floral Summer Dress" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">Floral Summer Dress</p>
                          <p className="text-sm text-muted-foreground">Size: S • Floral</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p>Qty: 1</p>
                        <p className="font-medium">KSh 2,850</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-muted rounded overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=150&auto=format&fit=crop" 
                            alt="Leather Crossbody Bag" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">Leather Crossbody Bag</p>
                          <p className="text-sm text-muted-foreground">Brown</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p>Qty: 1</p>
                        <p className="font-medium">KSh 3,499</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium mb-2">Customer Information</h3>
                    <p className="text-sm">Jane Doe</p>
                    <p className="text-sm text-muted-foreground">jane.doe@example.com</p>
                    <p className="text-sm text-muted-foreground">+254 712 345 678</p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <p className="text-sm">123 Mombasa Road</p>
                    <p className="text-sm text-muted-foreground">Nairobi, Kenya</p>
                    <p className="text-sm text-muted-foreground">00100</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium mb-2">Payment Information</h3>
                    <p className="text-sm">M-Pesa</p>
                    <p className="text-sm text-muted-foreground">Transaction ID: MPE123456789</p>
                    <Badge variant="outline" className="mt-1">Paid</Badge>
                  </div>
                  <div className="text-right">
                    <h3 className="font-medium mb-2">Order Summary</h3>
                    <div className="flex justify-between gap-8">
                      <p className="text-sm">Subtotal:</p>
                      <p className="text-sm">KSh 10,849</p>
                    </div>
                    <div className="flex justify-between gap-8">
                      <p className="text-sm">Shipping:</p>
                      <p className="text-sm">KSh 300</p>
                    </div>
                    <div className="flex justify-between gap-8 font-bold mt-1">
                      <p>Total:</p>
                      <p>KSh 11,149</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-end gap-4">
                <Button variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Scan Items
                </Button>
                <Button onClick={() => toast.success("Order status updated to 'Processing'")}>
                  <Package className="mr-2 h-4 w-4" />
                  Start Processing
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Additional orders would be listed here */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Order #TTS-20250407-0002</CardTitle>
                  <CardDescription>Placed 45 minutes ago</CardDescription>
                </div>
                <Button variant="outline">
                  <PrinterIcon className="mr-2 h-4 w-4" />
                  Print Receipt
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">2 items • KSh 5,600 • M-Pesa</p>
              <div className="mt-4 flex justify-end">
                <Button>
                  <Package className="mr-2 h-4 w-4" />
                  Start Processing
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="processing">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Processing orders will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ready">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Orders ready for pickup will appear here.</p>
            </CardContent>
          </Card>
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
