
import React from 'react';
import { 
  Calendar,
  ChevronLeft,
  Download,
  Filter,
  MapPin,
  Package,
  Truck,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useConnectivity } from '@/hooks/use-connectivity';

// Mock data
const weeklyStats = {
  deliveries: 28,
  onTime: 25,
  distance: 120,
  completionRate: 89
};

const monthlyDeliveries = [
  { date: '2024-04-01', count: 4 },
  { date: '2024-04-02', count: 3 },
  { date: '2024-04-03', count: 5 },
  { date: '2024-04-04', count: 2 },
  { date: '2024-04-05', count: 6 },
  { date: '2024-04-06', count: 1 },
  { date: '2024-04-07', count: 0 },
  { date: '2024-04-08', count: 3 },
  { date: '2024-04-09', count: 4 },
  { date: '2024-04-10', count: 0 }
];

const DeliveryReports = () => {
  const navigate = useNavigate();
  const { isOffline } = useConnectivity();
  
  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="bg-background p-4 flex items-center shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate('/staff/delivery')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium ml-2">Delivery Reports</h1>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {isOffline && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-md">
            <p className="text-sm">
              You are currently offline. Some report features may be limited.
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <Select defaultValue="week">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={isOffline}>
              <Filter className="h-4 w-4 mr-1.5" />
              Filter
            </Button>
            <Button variant="outline" size="sm" disabled={isOffline}>
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold">{weeklyStats.deliveries}</div>
              <p className="text-sm text-muted-foreground">Deliveries</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{weeklyStats.onTime}</div>
              <p className="text-sm text-muted-foreground">On-Time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                <MapPin className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{weeklyStats.distance} km</div>
              <p className="text-sm text-muted-foreground">Distance</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2">
                <Package className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold">{weeklyStats.completionRate}%</div>
              <p className="text-sm text-muted-foreground">Completion</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="performance" className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="text-muted-foreground">
                    Performance chart would appear here, showing metrics over time
                  </p>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">On-Time Delivery Rate</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: '89%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">First Attempt Success</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Daily Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="text-muted-foreground">
                    Activity chart would appear here, showing deliveries by day
                  </p>
                </div>
                
                <div className="mt-4 space-y-2">
                  <h3 className="font-medium text-sm mb-2">Delivery Count by Day</h3>
                  
                  {monthlyDeliveries.slice(0, 5).map((day) => (
                    <div key={day.date} className="flex items-center">
                      <div className="w-24 flex-shrink-0 text-sm">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex-1 h-8 flex items-center">
                        <div 
                          className="bg-primary h-4 rounded-sm"
                          style={{ width: `${Math.max(5, day.count * 12)}%` }}
                        ></div>
                        <span className="ml-2 text-sm">{day.count}</span>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="link" className="text-xs p-0 h-auto mt-2" disabled={isOffline}>
                    <Calendar className="h-3 w-3 mr-1" />
                    View Full Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Delivery Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Average Delivery Time</h3>
                  <p className="text-sm text-muted-foreground">Time from pickup to delivery</p>
                </div>
                <div className="text-xl font-bold">32 min</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Most Active Area</h3>
                  <p className="text-sm text-muted-foreground">Area with most deliveries</p>
                </div>
                <div className="text-md font-bold">Nairobi CBD</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Peak Delivery Time</h3>
                  <p className="text-sm text-muted-foreground">Busiest time for deliveries</p>
                </div>
                <div className="text-md font-bold">3PM - 5PM</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryReports;
