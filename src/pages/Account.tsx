
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, LogOut, Settings, ShoppingBag, Heart, Bell, MapPin, CreditCard } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { OrderHistory } from '@/components/account/OrderHistory';
import NotificationPreferences from '@/components/notifications/NotificationPreferences';
import LoyaltyPointsCard from '@/components/marketing/LoyaltyPointsCard';
import { AddressList } from '@/components/account/AddressList';
import { useAddresses } from '@/hooks/useAddresses';
import { ProfileEditForm } from '@/components/account/ProfileEditForm';
import { Skeleton } from '@/components/ui/skeleton';

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { 
    addresses, 
    loading: loadingAddresses, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress 
  } = useAddresses();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (!user.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name || 'User'}`} alt={user.name || 'User'} />
              <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{user.name || 'User'}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="grid grid-cols-6 w-full max-w-xl">
            <TabsTrigger value="profile">
              <UserIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              <Heart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Wishlist</span>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileEditForm />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="font-medium">Account Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date())}
                    </p>
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Danger Zone</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data.
                      </p>
                      <Button variant="destructive">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
            <OrderHistory />
          </TabsContent>
          
          <TabsContent value="addresses" className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Shipping Addresses</h2>
            {loadingAddresses ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full max-w-md" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              </div>
            ) : (
              <AddressList 
                addresses={addresses}
                onAddAddress={addAddress}
                onUpdateAddress={updateAddress}
                onDeleteAddress={deleteAddress}
                onSetDefault={setDefaultAddress}
              />
            )}
          </TabsContent>
          
          <TabsContent value="payments" className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
            <Card>
              <CardHeader>
                <CardTitle>Saved Payment Methods</CardTitle>
                <CardDescription>
                  Manage your saved payment information
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-10">
                <p className="text-muted-foreground mb-4">You don't have any saved payment methods yet.</p>
                <Button>
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wishlist" className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
            <div className="text-center py-10">
              <p className="text-muted-foreground">Your wishlist is empty.</p>
              <Button className="mt-4" onClick={() => navigate('/shop')}>
                Continue Shopping
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Notification Preferences</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <NotificationPreferences />
              <LoyaltyPointsCard />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;
