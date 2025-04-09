
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  Box, 
  Truck, 
  Calendar, 
  Clock, 
  BarChart3, 
  Bell,
  MessageSquare,
  FileText,
  ArrowRight
} from 'lucide-react';

const StaffDashboard = () => {
  const { user } = useAuth();
  const role = user?.role || 'staff';
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Staff Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome, {user?.name || 'Staff Member'}. Role: {role.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/staff/profile">My Profile</Link>
              </Button>
              <Button variant="outline" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  3
                </span>
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0) || 'S'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        <main className="space-y-6">
          {/* Role-based dashboard content */}
          {role === 'productManager' && <ProductManagerDashboard />}
          {role === 'orderPreparer' && <OrderPreparerDashboard />}
          {role === 'deliveryStaff' && <DeliveryStaffDashboard />}
          
          {/* Common sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center">
                      <div className="text-lg font-bold">10</div>
                      <div className="text-xs text-muted-foreground">APR</div>
                    </div>
                    <div>
                      <div className="font-medium">Morning Shift</div>
                      <div className="text-sm text-muted-foreground">8:00 AM - 2:00 PM</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center">
                      <div className="text-lg font-bold">12</div>
                      <div className="text-xs text-muted-foreground">APR</div>
                    </div>
                    <div>
                      <div className="font-medium">Afternoon Shift</div>
                      <div className="text-sm text-muted-foreground">2:00 PM - 8:00 PM</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center">
                      <div className="text-lg font-bold">15</div>
                      <div className="text-xs text-muted-foreground">APR</div>
                    </div>
                    <div>
                      <div className="font-medium">Morning Shift</div>
                      <div className="text-sm text-muted-foreground">8:00 AM - 2:00 PM</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="w-full justify-between">
                  <Link to="/staff/schedule">
                    View Full Schedule
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex justify-between">
                        <div className="font-medium">John Doe</div>
                        <div className="text-xs text-muted-foreground">10:30 AM</div>
                      </div>
                      <div className="text-sm text-muted-foreground">Can you help with the inventory count tomorrow?</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex justify-between">
                        <div className="font-medium">Team Announcement</div>
                        <div className="text-xs text-muted-foreground">Yesterday</div>
                      </div>
                      <div className="text-sm text-muted-foreground">Team meeting scheduled for Friday at 2pm.</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="w-full justify-between">
                  <Link to="/staff/communications">
                    View All Messages
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Training Materials
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">New Product Processing</div>
                    <div className="text-sm text-muted-foreground">Learn how to effectively process new inventory.</div>
                    <div className="mt-1">
                      <Badge variant="secondary">Required</Badge>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Customer Service Excellence</div>
                    <div className="text-sm text-muted-foreground">Best practices for exceptional customer service.</div>
                    <div className="mt-1">
                      <Badge variant="outline" className="bg-green-500/20 text-green-500">Completed</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="w-full justify-between">
                  <Link to="/staff/training">
                    View All Training
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

// Role-specific dashboard content
const ProductManagerDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-3">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">27</h3>
            <p className="text-sm text-muted-foreground">Products to Process</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-3">
              <Box className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">12</h3>
            <p className="text-sm text-muted-foreground">Products Added Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">14.2<span className="text-base font-normal">min</span></h3>
            <p className="text-sm text-muted-foreground">Avg. Processing Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-3">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">4.8<span className="text-base font-normal">/5</span></h3>
            <p className="text-sm text-muted-foreground">Product Quality Rating</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Inventory</CardTitle>
          <CardDescription>
            Recently added products that need processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-3 border rounded-lg">
                <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={`https://images.unsplash.com/photo-1578652201439-${i}afc2a3ed2dc?q=80&w=120&auto=format&fit=crop`} 
                    alt="Product" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Vintage Denim Jacket {i}</h4>
                    <Badge>New</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Received: {new Date().toLocaleDateString()}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">Process</Button>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild className="w-full">
            <Link to="/staff/products">View All Inventory</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const OrderPreparerDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-3">
              <Box className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">8</h3>
            <p className="text-sm text-muted-foreground">Pending Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-3">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">15</h3>
            <p className="text-sm text-muted-foreground">Orders Processed Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">6.4<span className="text-base font-normal">min</span></h3>
            <p className="text-sm text-muted-foreground">Avg. Processing Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-3">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">98<span className="text-base font-normal">%</span></h3>
            <p className="text-sm text-muted-foreground">Order Accuracy</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Orders to Process</CardTitle>
          <CardDescription>
            Orders awaiting preparation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-3 border rounded-lg">
                <div className="rounded-full w-10 h-10 bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Box className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Order #TTS-20250409-{1000 + i}</h4>
                    <Badge>New</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Customer: Jane Smith</p>
                  <p className="text-sm text-muted-foreground">Items: 3 | Total: KSh 5,400</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm">Process Order</Button>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild className="w-full">
            <Link to="/staff/orders">View All Orders</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const DeliveryStaffDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-3">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">6</h3>
            <p className="text-sm text-muted-foreground">Deliveries Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-3">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">4</h3>
            <p className="text-sm text-muted-foreground">Completed Deliveries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">28<span className="text-base font-normal">min</span></h3>
            <p className="text-sm text-muted-foreground">Avg. Delivery Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center mb-3">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">4.9<span className="text-base font-normal">/5</span></h3>
            <p className="text-sm text-muted-foreground">Customer Rating</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Today's Deliveries</CardTitle>
          <CardDescription>
            Orders to be delivered today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-start gap-4 p-3 border rounded-lg">
                <div className="rounded-full w-10 h-10 bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Order #TTS-20250409-{2000 + i}</h4>
                    {i === 1 ? (
                      <Badge className="bg-yellow-500/20 text-yellow-500">In Progress</Badge>
                    ) : (
                      <Badge>Ready</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Customer: John Doe</p>
                  <p className="text-sm text-muted-foreground">Address: 123 Nairobi Way, Karen</p>
                  <p className="text-sm text-muted-foreground">Expected delivery: 2:00 PM - 4:00 PM</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm">Start Delivery</Button>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild className="w-full">
            <Link to="/staff/deliveries">View All Deliveries</Link>
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Delivery Route</CardTitle>
          <CardDescription>
            Optimized route for today's deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-md overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127635.66247630147!2d36.752610273193356!3d-1.3028617905594762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11655c311541%3A0x9dd769ac1c10b897!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1650123456789!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Delivery Map"
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDashboard;
