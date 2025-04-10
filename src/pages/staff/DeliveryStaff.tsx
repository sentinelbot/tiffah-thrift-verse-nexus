
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Check, 
  Clock, 
  Map, 
  MapPin, 
  PackageCheck, 
  Phone, 
  Search, 
  Truck, 
  User 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const DeliveryStaff = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deliveries</h1>
        <p className="text-muted-foreground">Manage and track order deliveries</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <PackageCheck className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ready for Pickup</p>
              <h3 className="text-2xl font-bold">5</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Out for Delivery</p>
              <h3 className="text-2xl font-bold">3</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Delivered Today</p>
              <h3 className="text-2xl font-bold">8</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search deliveries..."
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Map className="h-4 w-4 mr-2" /> View Map
          </Button>
          <Button size="sm">
            <Truck className="h-4 w-4 mr-2" /> Start Delivery Run
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="ready">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="ready">Ready for Pickup (5)</TabsTrigger>
          <TabsTrigger value="delivering">In Progress (3)</TabsTrigger>
          <TabsTrigger value="completed">Completed (8)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ready" className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <PackageCheck className="h-6 w-6 text-indigo-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Order #TTS-20250410-{4000 + i}</h3>
                        <Badge className="bg-indigo-500">Ready</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-3 w-3 mr-1" /> Jane Smith
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" /> +254712345{i}78
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> 123 Main St, Nairobi, Kenya
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 ml-auto">
                    <div className="text-right">
                      <div className="flex items-center text-sm font-medium">
                        <Clock className="h-3 w-3 mr-1" /> Express Delivery
                      </div>
                      <p className="text-sm text-muted-foreground">{i} item(s)</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/order/delivery-${i}`}>Details</Link>
                      </Button>
                      <Button size="sm">Pick Up</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="delivering" className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Truck className="h-6 w-6 text-purple-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Order #TTS-20250410-{5000 + i}</h3>
                        <Badge className="bg-purple-500">Out for Delivery</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-3 w-3 mr-1" /> John Doe
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" /> +254723456{i}89
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> 456 Park Ave, Nairobi, Kenya
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 ml-auto">
                    <div className="text-right">
                      <div className="flex items-center text-sm font-medium">
                        <Calendar className="h-3 w-3 mr-1" /> Today, by 4:00 PM
                      </div>
                      <p className="text-sm text-muted-foreground">{i + 2} item(s)</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Map className="h-4 w-4 mr-2" /> Navigate
                      </Button>
                      <Button size="sm">Deliver</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Order #TTS-20250410-{6000 + i}</h3>
                        <Badge className="bg-green-500">Delivered</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-3 w-3 mr-1" /> Mary Johnson
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" /> {i} hour(s) ago
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> 789 Oak St, Nairobi, Kenya
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 ml-auto">
                    <div className="text-right">
                      <div className="flex items-center text-sm font-medium">
                        <Check className="h-3 w-3 mr-1" /> Signed by recipient
                      </div>
                      <p className="text-sm text-muted-foreground">Delivered at {10 + i}:00 AM</p>
                    </div>
                    
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/order/delivered-${i}`}>Details</Link>
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

export default DeliveryStaff;
