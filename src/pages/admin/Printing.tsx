
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Printer, AlertCircle, Settings } from 'lucide-react';
import PrinterStatus from '@/components/admin/printing/PrinterStatus';
import PrintJobHistory from '@/components/admin/printing/PrintJobHistory';
import { useAuth } from '@/contexts/AuthContext';

const PrintingPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Only certain roles should access this page
  const allowedRoles = ['admin', 'productManager', 'orderPreparer', 'deliveryStaff'];
  const isAuthorized = user && allowedRoles.includes(user.role);
  
  if (!isAuthorized) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unauthorized Access</AlertTitle>
            <AlertDescription>
              You don't have permission to access the printing system.
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Cloud Printing</h1>
            <p className="text-muted-foreground">
              Manage printers and print jobs for your store
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Printer Settings
            </Button>
            <Button>
              <Printer className="h-4 w-4 mr-2" />
              Print Test Page
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Print Jobs</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>PrintNode Integration</CardTitle>
                  <CardDescription>
                    Cloud printing for your thrift store operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      The PrintNode integration enables cloud printing for various operations:
                    </p>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>
                        <span className="font-medium">Product Labels:</span> Generate and print barcode 
                        labels for new inventory items
                      </li>
                      <li>
                        <span className="font-medium">Order Receipts:</span> Print order details for 
                        order preparation
                      </li>
                      <li>
                        <span className="font-medium">Shipping Labels:</span> Print shipping labels for 
                        deliveries with customer information
                      </li>
                    </ul>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 text-blue-500 p-3 rounded-md mt-4">
                      <p className="text-sm">
                        <strong>Note:</strong> This is a simulated implementation for demonstration purposes.
                        In a production environment, this would connect to the actual PrintNode API.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <PrinterStatus />
            </div>
            
            <PrintJobHistory />
          </TabsContent>
          
          <TabsContent value="jobs" className="space-y-6">
            <PrintJobHistory />
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Print Templates</CardTitle>
                <CardDescription>
                  Manage your printing templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    This section will allow you to manage and customize your print templates for 
                    various document types.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Product Label</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Standard product label with barcode, price, and product details.
                        </p>
                        <Button variant="outline" size="sm" className="mt-4 w-full">
                          Edit Template
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Order Receipt</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Detailed order receipt with customer information and item list.
                        </p>
                        <Button variant="outline" size="sm" className="mt-4 w-full">
                          Edit Template
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Shipping Label</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Shipping label with customer address and order details.
                        </p>
                        <Button variant="outline" size="sm" className="mt-4 w-full">
                          Edit Template
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default PrintingPage;
