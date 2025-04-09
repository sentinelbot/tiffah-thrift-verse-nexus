
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScanBarcode, Package, ShoppingBag, Truck, History } from 'lucide-react';
import ProductScanner from '@/components/barcode/ProductScanner';
import OrderScanner from '@/components/barcode/OrderScanner';
import DeliveryScanner from '@/components/barcode/DeliveryScanner';
import ScanHistory from '@/components/barcode/ScanHistory';

const Scanning = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('history');

  // Determine which tabs to show based on user role
  const showProductTab = user?.role === 'admin' || user?.role === 'productManager';
  const showOrderTab = user?.role === 'admin' || user?.role === 'orderPreparer';
  const showDeliveryTab = user?.role === 'admin' || user?.role === 'deliveryStaff';

  // Set default tab based on user role
  useState(() => {
    if (user) {
      if (user.role === 'productManager' && showProductTab) {
        setActiveTab('product');
      } else if (user.role === 'orderPreparer' && showOrderTab) {
        setActiveTab('order');
      } else if (user.role === 'deliveryStaff' && showDeliveryTab) {
        setActiveTab('delivery');
      }
    }
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Barcode Scanning</h1>
          <p className="text-muted-foreground">
            Scan products, orders, and deliveries using your device camera
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden md:inline">History</span>
            </TabsTrigger>
            
            {showProductTab && (
              <TabsTrigger value="product" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden md:inline">Products</span>
              </TabsTrigger>
            )}
            
            {showOrderTab && (
              <TabsTrigger value="order" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden md:inline">Orders</span>
              </TabsTrigger>
            )}
            
            {showDeliveryTab && (
              <TabsTrigger value="delivery" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="hidden md:inline">Deliveries</span>
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="history">
            <ScanHistory />
          </TabsContent>
          
          {showProductTab && (
            <TabsContent value="product">
              <ProductScanner />
            </TabsContent>
          )}
          
          {showOrderTab && (
            <TabsContent value="order">
              <OrderScanner />
            </TabsContent>
          )}
          
          {showDeliveryTab && (
            <TabsContent value="delivery">
              <DeliveryScanner />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Scanning;
