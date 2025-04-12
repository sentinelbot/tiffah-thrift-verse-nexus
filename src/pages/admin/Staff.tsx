import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Edit, Trash2, RefreshCw } from 'lucide-react';

const Staff = () => {
  // Mock staff data - in a real app this would come from an API
  const staffMembers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', lastActive: '2 hours ago' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'productManager', lastActive: '1 day ago' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'orderPreparer', lastActive: '3 days ago' },
    { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'deliveryStaff', lastActive: '5 hours ago' },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage staff accounts</p>
        </div>
        <Button className="flex items-center">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Staff</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="productManager">Product Managers</TabsTrigger>
          <TabsTrigger value="orderPreparer">Order Preparers</TabsTrigger>
          <TabsTrigger value="deliveryStaff">Delivery Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Staff Members</CardTitle>
                <Button variant="outline" size="sm" className="flex items-center">
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Refresh
                </Button>
              </div>
              <CardDescription>Manage your staff accounts and permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>
                        <span className="capitalize">{staff.role}</span>
                      </TableCell>
                      <TableCell>{staff.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tab contents would be similar, filtered by role */}
        <TabsContent value="admin" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Admin Staff</CardTitle>
              <CardDescription>Manage your administrator accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                {/* Similar table with filtered data */}
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers
                    .filter((staff) => staff.role === 'admin')
                    .map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>{staff.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar structure for other roles */}
      </Tabs>
    </AdminLayout>
  );
};

export default Staff;
