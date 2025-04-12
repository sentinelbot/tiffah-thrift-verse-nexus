
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Bell, 
  LogOut, 
  Lock,
  Edit,
  Save,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import OrderHistory from '@/components/account/OrderHistory';

const Account = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  
  // Mock user profile data
  const [profile, setProfile] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+254712345678',
    addresses: [
      {
        id: '1',
        isDefault: true,
        name: 'Home',
        fullName: 'John Doe',
        street: '123 Main St',
        city: 'Nairobi',
        state: '',
        postalCode: '00100',
        country: 'Kenya',
        phone: '+254712345678'
      },
      {
        id: '2',
        isDefault: false,
        name: 'Work',
        fullName: 'John Doe',
        street: '456 Business Park',
        city: 'Nairobi',
        state: '',
        postalCode: '00200',
        country: 'Kenya',
        phone: '+254712345678'
      }
    ]
  });
  
  const handleLogout = async () => {
    await signOut();
  };
  
  const handleSaveProfile = () => {
    setEditMode(false);
    // Here you would save the profile changes to the server
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* User info and nav sidebar */}
            <div className="w-full md:w-80">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src="" alt={profile.name} />
                      <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <h2 className="text-xl font-bold">{profile.name}</h2>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                orientation="vertical"
                className="space-y-4"
              >
                <TabsList className="grid grid-cols-1 h-auto">
                  <TabsTrigger value="profile" className="justify-start text-left">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="justify-start text-left">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="wishlist" className="justify-start text-left">
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </TabsTrigger>
                  <TabsTrigger value="addresses" className="justify-start text-left">
                    <MapPin className="mr-2 h-4 w-4" />
                    Addresses
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start text-left">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="security" className="justify-start text-left">
                    <Lock className="mr-2 h-4 w-4" />
                    Security
                  </TabsTrigger>
                </TabsList>
                
                <Button variant="ghost" className="w-full justify-start text-left" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </Tabs>
            </div>
            
            {/* Content area */}
            <div className="flex-1">
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Manage your personal information</CardDescription>
                      </div>
                      {!editMode ? (
                        <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      ) : (
                        <Button variant="default" size="sm" onClick={handleSaveProfile}>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          {editMode ? (
                            <Input
                              id="name"
                              value={profile.name}
                              onChange={(e) => setProfile({...profile, name: e.target.value})}
                            />
                          ) : (
                            <div className="p-2 bg-muted rounded-md">{profile.name}</div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          {editMode ? (
                            <Input
                              id="email"
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile({...profile, email: e.target.value})}
                            />
                          ) : (
                            <div className="p-2 bg-muted rounded-md">{profile.email}</div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          {editMode ? (
                            <Input
                              id="phone"
                              value={profile.phone}
                              onChange={(e) => setProfile({...profile, phone: e.target.value})}
                            />
                          ) : (
                            <div className="p-2 bg-muted rounded-md">{profile.phone}</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Additional fields like birthday, gender etc. could be added here */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View and track your orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OrderHistory />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="wishlist" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Wishlist</CardTitle>
                    <CardDescription>Items you've saved for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link to="/wishlist">View Wishlist</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="addresses" className="mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Saved Addresses</CardTitle>
                        <CardDescription>Manage your shipping addresses</CardDescription>
                      </div>
                      <Button size="sm">
                        Add New Address
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.addresses.map(address => (
                        <div key={address.id} className="border rounded-lg p-4 relative">
                          {address.isDefault && (
                            <Badge className="absolute top-4 right-4 bg-primary">Default</Badge>
                          )}
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium mb-1">{address.name}</h3>
                              <p className="text-sm">{address.fullName}</p>
                              <p className="text-sm">{address.street}</p>
                              <p className="text-sm">{address.city}, {address.postalCode}</p>
                              <p className="text-sm">{address.country}</p>
                              <p className="text-sm mt-1">{address.phone}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          
                          {!address.isDefault && (
                            <Button variant="link" className="text-sm h-auto p-0 mt-2">
                              Set as Default
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how we communicate with you</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Notification preferences coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your security preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline">
                      Change Password
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
