
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const StaffDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Your assigned tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No tasks assigned yet.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Your recent performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Performance metrics will appear here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Recent announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No announcements at this time.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffDashboard;
