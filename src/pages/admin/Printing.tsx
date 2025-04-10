import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PrinterStatus from '@/components/admin/printing/PrinterStatus';
import PrintJobHistory from '@/components/admin/printing/PrintJobHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Package, FileText, Truck } from 'lucide-react';
import OrderReceiptPrint from '@/components/admin/printing/OrderReceiptPrint';
import { useConnectivity } from '@/hooks/use-connectivity';
import { Order } from '@/types/order';

// Mock order for demo purposes that matches the Order type
const mockOrder = {
  id: 'ORD-123456',
  orderNumber: 'TTS-20240410-0001',
  customer: {
    id: 'cust-001',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+254712345678'
  },
  items: [
    {
      productId: 'prod-001',
      product: {
        id: 'prod-001',
        title: 'Vintage Denim Jacket',
        price: 2500,
        imageUrl: '/placeholder.svg'
      },
      quantity: 1,
      price: 2500
    },
    {
      productId: 'prod-002',
      product: {
        id: 'prod-002',
        title: 'Floral Summer Dress',
        price: 1800,
        imageUrl: '/placeholder.svg'
      },
      quantity: 1,
      price: 1800
    }
  ],
  totalAmount: 4300,
  status: 'processing',
  paymentInfo: {
    method: 'mpesa',
    status: 'completed',
    transactionId: 'MP123456789',
    amount: 4300
  },
  shippingInfo: {
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+254712345678',
    address: '123 Kimathi Street',
    city: 'Nairobi',
    state: 'Nairobi',
    postalCode: '00100',
    country: 'Kenya',
    shippingMethod: 'standard'
  },
  deliveryInfo: {
    estimatedDelivery: new Date('2024-04-15')
  },
  orderDate: new Date('2024-04-10T10:30:00'),
  history: [
    {
      timestamp: new Date('2024-04-10T10:30:00'),
      status: 'pending',
      note: 'Order created'
    },
    {
      timestamp: new Date('2024-04-10T10:35:00'),
      status: 'processing',
      note: 'Payment confirmed'
    }
  ]
} as Order;

const Printing = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { isOffline } = useConnectivity();
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Cloud Printing</h1>
          <p className="text-muted-foreground">
            Manage printers, view print jobs, and print various documents
          </p>
        </div>
        
        {isOffline && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-4 rounded-md">
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              You are currently offline. Print jobs will be queued and processed when you're back online.
            </p>
          </div>
        )}
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Printer className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="printers" className="flex items-center gap-1">
              <Printer className="h-4 w-4" />
              Printers
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Print Jobs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PrinterStatus />
              
              <Card>
                <CardHeader>
                  <CardTitle>Print Documents</CardTitle>
                  <CardDescription>Select document type to print</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="border border-dashed">
                      <CardContent className="pt-6 text-center">
                        <div className="rounded-full bg-primary/10 p-3 w-12 h-12 mx-auto flex items-center justify-center mb-4">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium mb-1">Product Label</h3>
                        <p className="text-sm text-muted-foreground mb-4">Print barcode for products</p>
                        <Button variant="outline" size="sm" className="w-full" disabled={isOffline}>
                          Print Product Label
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-dashed">
                      <CardContent className="pt-6 text-center">
                        <div className="rounded-full bg-primary/10 p-3 w-12 h-12 mx-auto flex items-center justify-center mb-4">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium mb-1">Order Receipt</h3>
                        <p className="text-sm text-muted-foreground mb-4">Print receipt for orders</p>
                        <OrderReceiptPrint order={mockOrder} variant="outline" size="sm" />
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-dashed sm:col-span-2">
                      <CardContent className="pt-6 text-center">
                        <div className="rounded-full bg-primary/10 p-3 w-12 h-12 mx-auto flex items-center justify-center mb-4">
                          <Truck className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium mb-1">Shipping Label</h3>
                        <p className="text-sm text-muted-foreground mb-4">Print shipping labels for delivery</p>
                        <Button variant="outline" size="sm" className="w-full" disabled={isOffline}>
                          Print Shipping Label
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="printers">
            <PrinterStatus />
          </TabsContent>
          
          <TabsContent value="jobs">
            <PrintJobHistory />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Printing;
