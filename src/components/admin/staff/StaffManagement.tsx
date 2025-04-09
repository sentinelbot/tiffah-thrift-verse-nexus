
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffPerformance } from '@/components/admin/staff/StaffPerformance';
import { Button } from '@/components/ui/button';
import { Plus, UserCheck, UserCog, Users } from 'lucide-react';

const StaffManagement = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground">
              Manage staff members and monitor performance
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add Staff Member
          </Button>
        </div>

        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Staff List</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <span>Roles & Permissions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <StaffPerformance />
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Directory</CardTitle>
                <CardDescription>
                  View and manage all staff members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Staff listing component will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>
                  Configure staff roles and access levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Role management component will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default StaffManagement;
