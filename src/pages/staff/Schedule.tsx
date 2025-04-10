
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Check, 
  Clock, 
  ClockX, 
  Download, 
  Plus, 
  RefreshCw, 
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Schedule = () => {
  const { user } = useAuth();
  
  const currentWeek = React.useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  }, []);
  
  // Mock schedule data
  const schedule = React.useMemo(() => {
    const isProductManager = user?.role === 'productManager';
    const isOrderPreparer = user?.role === 'orderPreparer';
    const isDeliveryStaff = user?.role === 'deliveryStaff';
    
    return [
      { // Sunday
        isWorkday: false,
        shift: null,
        hours: 0,
      },
      { // Monday
        isWorkday: true,
        shift: '9:00 AM - 5:00 PM',
        hours: 8,
        tasks: isProductManager ? ['Inventory processing', 'Product photos'] : 
               isOrderPreparer ? ['Order preparation', 'Quality check'] :
               isDeliveryStaff ? ['Morning deliveries', 'Afternoon deliveries'] : []
      },
      { // Tuesday
        isWorkday: true,
        shift: '9:00 AM - 5:00 PM',
        hours: 8,
        tasks: isProductManager ? ['New arrivals', 'Barcode printing'] : 
               isOrderPreparer ? ['Express orders', 'Stock organization'] :
               isDeliveryStaff ? ['City center deliveries', 'Returns processing'] : []
      },
      { // Wednesday
        isWorkday: true,
        shift: '9:00 AM - 5:00 PM',
        hours: 8,
        tasks: isProductManager ? ['Inventory audit', 'Category organization'] : 
               isOrderPreparer ? ['Order packing', 'Shipping label printing'] :
               isDeliveryStaff ? ['Suburban deliveries', 'Vehicle maintenance'] : []
      },
      { // Thursday
        isWorkday: true,
        shift: '9:00 AM - 5:00 PM',
        hours: 8,
        tasks: isProductManager ? ['Price updates', 'Product descriptions'] : 
               isOrderPreparer ? ['Priority orders', 'Inventory restocking'] :
               isDeliveryStaff ? ['Express deliveries', 'Delivery route planning'] : []
      },
      { // Friday
        isWorkday: true,
        shift: '9:00 AM - 5:00 PM',
        hours: 8,
        tasks: isProductManager ? ['Weekly inventory report', 'Staff training'] : 
               isOrderPreparer ? ['Weekend order preparation', 'Quality control'] :
               isDeliveryStaff ? ['Downtown deliveries', 'Delivery confirmation'] : []
      },
      { // Saturday
        isWorkday: true,
        shift: '10:00 AM - 4:00 PM',
        hours: 6,
        tasks: isProductManager ? ['Weekend inventory', 'Special promotions'] : 
               isOrderPreparer ? ['Weekend orders', 'Express shipping'] :
               isDeliveryStaff ? ['Weekend deliveries', 'Route optimization'] : []
      },
    ];
  }, [user?.role]);
  
  // Calculate total hours
  const totalHours = React.useMemo(() => {
    return schedule.reduce((total, day) => total + day.hours, 0);
  }, [schedule]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">Your weekly work schedule</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>
      
      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>April 10 - April 16, 2025</CardTitle>
              <CardDescription>Current work week</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" /> View Calendar
              </Button>
              <Button size="sm">
                <UserCheck className="h-4 w-4 mr-2" /> Clock In
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {currentWeek.map((date, index) => {
              const day = schedule[index];
              const isToday = new Date().toDateString() === date.toDateString();
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const dayDate = date.getDate();
              
              return (
                <div 
                  key={index} 
                  className={`rounded-md border p-3 ${isToday ? 'bg-primary/5 border-primary' : ''}`}
                >
                  <div className="text-center mb-2">
                    <p className="text-sm font-medium">{dayName}</p>
                    <p className={`text-2xl font-bold ${isToday ? 'text-primary' : ''}`}>{dayDate}</p>
                  </div>
                  
                  {day.isWorkday ? (
                    <div className="space-y-2">
                      <Badge variant="outline" className="w-full justify-center">
                        {day.shift}
                      </Badge>
                      <div className="text-center text-sm">
                        <p className="text-muted-foreground">{day.hours} hours</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[calc(100%-2rem)]">
                      <p className="text-sm text-muted-foreground">Day Off</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total Hours: {totalHours}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Shifts Completed: 2</span>
              </div>
              
              <div className="flex items-center gap-2">
                <ClockX className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Pending: 4</span>
              </div>
            </div>
            
            <Button variant="link" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Request Time Off
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Daily Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Tasks</CardTitle>
          <CardDescription>Assigned responsibilities for the day</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Find today's schedule */}
          {(() => {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const todaySchedule = schedule[dayOfWeek];
            
            if (!todaySchedule || !todaySchedule.isWorkday) {
              return (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">You don't have any tasks scheduled for today.</p>
                </div>
              );
            }
            
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Working Hours</p>
                    <p className="text-sm text-muted-foreground">{todaySchedule.shift}</p>
                  </div>
                  
                  <Badge variant="outline" className="capitalize">{user?.role || 'staff'}</Badge>
                </div>
                
                <div className="space-y-2">
                  {todaySchedule.tasks?.map((task, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-md">
                      <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                        {index === 0 && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                      </div>
                      <p className="font-medium">{task}</p>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Add Task
                </Button>
              </div>
            );
          })()}
        </CardContent>
      </Card>
      
      {/* Upcoming Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Schedule</CardTitle>
          <CardDescription>Future shifts and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-md">
              <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Team Meeting</p>
                  <Badge>Mandatory</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Monday, April 17, 2025 • 9:00 AM - 10:00 AM</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-md">
              <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Inventory Training</p>
                  <Badge variant="outline">Optional</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Wednesday, April 19, 2025 • 2:00 PM - 3:30 PM</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-md">
              <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Monthly Review</p>
                  <Badge>Mandatory</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Friday, April 30, 2025 • 3:00 PM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Schedule;
