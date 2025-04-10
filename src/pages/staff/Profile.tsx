
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Printer, User } from 'lucide-react';

const StaffProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(user?.name || '');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      await updateProfile({ name });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>{user?.name || 'Staff Member'}</CardTitle>
                <div className="flex items-center justify-center mt-2">
                  <Badge className="capitalize">{user?.role || 'staff'}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-muted rounded-md">
                  <p className="text-2xl font-bold">28</p>
                  <p className="text-xs text-muted-foreground">Orders Processed</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <p className="text-2xl font-bold">97%</p>
                  <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                </div>
              </div>
              
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Email:</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">ID:</p>
                  <p className="font-medium">STF-{user?.id?.slice(0, 8) || '12345678'}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Joined:</p>
                  <p className="font-medium">April 10, 2025</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Printer className="h-4 w-4 mr-2" /> Print ID Badge
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Stats</CardTitle>
              <CardDescription>Your productivity metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Productivity</p>
                    <p className="text-sm font-medium">92%</p>
                  </div>
                  <div className="h-2 bg-muted rounded-full mt-1">
                    <div className="h-full bg-primary rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Accuracy</p>
                    <p className="text-sm font-medium">97%</p>
                  </div>
                  <div className="h-2 bg-muted rounded-full mt-1">
                    <div className="h-full bg-primary rounded-full" style={{ width: '97%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Efficiency</p>
                    <p className="text-sm font-medium">88%</p>
                  </div>
                  <div className="h-2 bg-muted rounded-full mt-1">
                    <div className="h-full bg-primary rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                {isEditing ? (
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                ) : (
                  <div className="p-2 border rounded-md">{user?.name || 'Not set'}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="p-2 border rounded-md">{user?.email || 'Not set'}</div>
                <p className="text-xs text-muted-foreground">Contact admin to change your email</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <div className="p-2 border rounded-md capitalize">{user?.role || 'staff'}</div>
                <p className="text-xs text-muted-foreground">Contact admin to change your role</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateProfile} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Processed Order #TTS-20250410-1234', time: '30 minutes ago' },
                  { action: 'Updated inventory for Item TTS-12345', time: '1 hour ago' },
                  { action: 'Logged in to the system', time: '3 hours ago' },
                  { action: 'Completed training module: Inventory Management', time: 'Yesterday' },
                  { action: 'Processed Order #TTS-20250409-5678', time: 'Yesterday' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
