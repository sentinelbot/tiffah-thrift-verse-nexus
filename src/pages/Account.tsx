
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { OrderHistory } from "@/components/account/OrderHistory";
import { User, Package, Heart, LogOut, Settings } from "lucide-react";

const Account = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Redirect to auth page if not logged in
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  // Get user initials for avatar
  const getInitials = () => {
    if (user.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return user.email?.substring(0, 2).toUpperCase() || "U";
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-muted-foreground">Manage your account settings and view orders</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-64 flex-shrink-0">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-20 w-20 mb-2">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <h2 className="font-semibold text-lg">{user.displayName || user.email}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  <div className="space-y-1">
                    <Button 
                      variant={activeTab === "profile" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button 
                      variant={activeTab === "orders" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("orders")}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Button>
                    <Button 
                      variant={activeTab === "wishlist" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("wishlist")}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Button>
                    <Button 
                      variant={activeTab === "settings" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Separator className="my-2" />
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive" 
                      onClick={signOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6 hidden">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>Manage your profile information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          value={user.displayName || ""} 
                          disabled 
                          className="max-w-md"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={user.email || ""} 
                          disabled 
                          className="max-w-md"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="joined">Member Since</Label>
                        <Input 
                          id="joined" 
                          value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} 
                          disabled 
                          className="max-w-md"
                        />
                      </div>
                      
                      <Button>Update Profile</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="orders">
                  <OrderHistory />
                </TabsContent>
                
                <TabsContent value="wishlist">
                  <Card>
                    <CardHeader>
                      <CardTitle>Wishlist</CardTitle>
                      <CardDescription>Items you've saved for later</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Wishlist content here */}
                      <p>Your wishlist items will appear here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Settings</CardTitle>
                      <CardDescription>Manage your account settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="password">Change Password</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="password" 
                            type="password" 
                            placeholder="New password" 
                            className="max-w-md"
                          />
                          <Button>Change</Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium mb-2">Communication Preferences</h3>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="emailOffers" 
                            className="h-4 w-4 rounded border-gray-300 text-primary"
                          />
                          <Label htmlFor="emailOffers">Receive email offers and updates</Label>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <input 
                            type="checkbox" 
                            id="orderUpdates" 
                            className="h-4 w-4 rounded border-gray-300 text-primary"
                            defaultChecked
                          />
                          <Label htmlFor="orderUpdates">Receive order status updates</Label>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium text-destructive mb-2">Danger Zone</h3>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
