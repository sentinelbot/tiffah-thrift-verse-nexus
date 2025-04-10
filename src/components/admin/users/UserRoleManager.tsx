
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { getUserRoles, assignRoleToUser, removeRoleFromUser } from '@/utils/authUtils';
import { Input } from '@/components/ui/input';

interface UserRoleManagerProps {
  userId: string;
  userName: string;
  currentRole?: string;
  onRoleChange?: (role: string) => void;
}

const AVAILABLE_ROLES = [
  { id: 'admin', name: 'Admin' },
  { id: 'customer', name: 'Customer' },
  { id: 'productManager', name: 'Product Manager' },
  { id: 'orderPreparer', name: 'Order Preparer' },
  { id: 'deliveryStaff', name: 'Delivery Staff' },
];

const UserRoleManager: React.FC<UserRoleManagerProps> = ({
  userId,
  userName,
  currentRole,
  onRoleChange,
}) => {
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [mainRole, setMainRole] = useState<string>(currentRole || 'customer');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [roleToAdd, setRoleToAdd] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUserRoles();
  }, [userId]);

  const loadUserRoles = async () => {
    setIsLoading(true);
    try {
      const roles = await getUserRoles(userId);
      setUserRoles(roles);
      
      // If there's no current role set yet, use the first role from the fetched roles
      if (!currentRole && roles.length > 0) {
        setMainRole(roles[0]);
      }
    } catch (error) {
      console.error('Error loading user roles:', error);
      toast.error('Failed to load user roles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMainRole = async (newRole: string) => {
    setIsUpdating(true);
    try {
      // Update the user's main role in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      
      setMainRole(newRole);
      toast.success(`Updated primary role to ${newRole}`);
      
      // Add the role to userRoles if not already present
      if (!userRoles.includes(newRole)) {
        setUserRoles(prev => [...prev, newRole]);
      }
      
      // Notify parent component if callback provided
      if (onRoleChange) {
        onRoleChange(newRole);
      }
    } catch (error) {
      console.error('Error updating main role:', error);
      toast.error('Failed to update main role');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddRole = async () => {
    if (!roleToAdd) return;
    
    setIsUpdating(true);
    try {
      const success = await assignRoleToUser(userId, roleToAdd);
      
      if (!success) throw new Error('Failed to assign role');
      
      // Update local state
      if (!userRoles.includes(roleToAdd)) {
        setUserRoles(prev => [...prev, roleToAdd]);
      }
      
      toast.success(`Added role: ${roleToAdd}`);
      setIsAddingRole(false);
      setRoleToAdd('');
    } catch (error) {
      console.error('Error adding role:', error);
      toast.error('Failed to add role');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveRole = async (role: string) => {
    // Don't allow removing the main role
    if (role === mainRole) {
      toast.error("Cannot remove the user's primary role");
      return;
    }
    
    setIsUpdating(true);
    try {
      const success = await removeRoleFromUser(userId, role);
      
      if (!success) throw new Error('Failed to remove role');
      
      // Update local state
      setUserRoles(prev => prev.filter(r => r !== role));
      toast.success(`Removed role: ${role}`);
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Filter available roles based on search query and roles the user doesn't already have
  const filteredRoles = AVAILABLE_ROLES.filter(role => 
    !userRoles.includes(role.id) && 
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
        <CardDescription>Manage roles for {userName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="main-role">Primary Role</Label>
            <Select 
              value={mainRole} 
              onValueChange={handleUpdateMainRole}
              disabled={isUpdating}
            >
              <SelectTrigger id="main-role" className="w-full mt-1">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ROLES.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              The primary role determines the user's main access level
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Additional Roles</Label>
              <Dialog open={isAddingRole} onOpenChange={setIsAddingRole}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Role
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Role</DialogTitle>
                    <DialogDescription>
                      Add an additional role to this user.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="role-search">Search Roles</Label>
                      <Input
                        id="role-search"
                        placeholder="Type to search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto space-y-2">
                      {filteredRoles.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No roles available or matching search.</p>
                      ) : (
                        filteredRoles.map((role) => (
                          <div
                            key={role.id}
                            className="flex items-center justify-between p-2 rounded hover:bg-accent cursor-pointer"
                            onClick={() => setRoleToAdd(role.id)}
                          >
                            <span>{role.name}</span>
                            <Badge variant={roleToAdd === role.id ? "default" : "outline"}>
                              {roleToAdd === role.id ? "Selected" : "Select"}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddingRole(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddRole} 
                      disabled={!roleToAdd || isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Role'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : userRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No roles assigned.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRoles.map((role) => (
                    <TableRow key={role}>
                      <TableCell className="font-medium capitalize">{role}</TableCell>
                      <TableCell>
                        {role === mainRole ? (
                          <Badge>Primary</Badge>
                        ) : (
                          <Badge variant="outline">Secondary</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {role !== mainRole && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveRole(role)}
                            disabled={isUpdating}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRoleManager;
