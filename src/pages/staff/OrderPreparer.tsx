
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Box, 
  CheckCircle2, 
  PackageCheck, 
  Printer, 
  QrCode, 
  Search, 
  ShoppingBag, 
  Timer
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

const OrderPreparer = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order Preparation</h1>
        <p className="text-muted-foreground">Manage and prepare customer orders</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Timer className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
              <h3 className="text-2xl font-bold">7</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <Box className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">In Progress</p>
              <h3 className="text-2xl font-bold">4</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <QrCode className="h-4 w-4 mr-2" /> Scan Order
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" /> Print Queue
          </Button>
          <Button size="sm">
            <PackageCheck className="h-4 w-4 mr-2" /> Mark Ready
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="pending">Pending (7)</TabsTrigger>
          <TabsTrigger value="processing">Processing (4)</TabsTrigger>
          <TabsTrigger value="ready">Ready (3)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Order #TTS-20250410-{1000 + i}</h3>
                        <Badge>Pending</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Placed 2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">KSh 3,450</p>
                      <p className="text-sm text-muted-foreground">3 items</p>
                    </div>
                    
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/order/mock-id-${i}`}>View Details</Link>
                    </Button>
                    
                    <Button size="sm">Prepare</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="processing" className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Order #TTS-20250410-{2000 + i}</h3>
                        <Badge className="bg-blue-500">Processing</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Started 30 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">KSh 5,200</p>
                      <p className="text-sm text-muted-foreground">4 items</p>
                    </div>
                    
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/order/mock-id-p${i}`}>View Details</Link>
                    </Button>
                    
                    <Button size="sm">Mark Ready</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="ready" className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Order #TTS-20250410-{3000 + i}</h3>
                        <Badge className="bg-indigo-500">Ready</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Ready for delivery</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">KSh 2,800</p>
                      <p className="text-sm text-muted-foreground">2 items</p>
                    </div>
                    
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/order/mock-id-r${i}`}>View Details</Link>
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Printer className="h-4 w-4 mr-2" /> Print
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderPreparer;
