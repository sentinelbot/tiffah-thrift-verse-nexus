
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InventoryOverview } from '@/components/admin/inventory/InventoryOverview';
import StockAlerts from '@/components/admin/inventory/StockAlerts';
import BarcodeManagement from '@/components/admin/inventory/BarcodeManagement';
import { Button } from '@/components/ui/button';
import { Warehouse, AlertTriangle, Barcode, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">
              Monitor stock levels, manage barcodes, and receive alerts
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Warehouse className="h-4 w-4" />
              Inventory Overview
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Stock Alerts
            </TabsTrigger>
            <TabsTrigger value="barcodes" className="flex items-center gap-1">
              <Barcode className="h-4 w-4" />
              Barcode Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <InventoryOverview />
          </TabsContent>
          
          <TabsContent value="alerts">
            <StockAlerts />
          </TabsContent>
          
          <TabsContent value="barcodes">
            <BarcodeManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default InventoryManagement;
