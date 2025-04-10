
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const StaffSchedule = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Work Schedule</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Shifts</CardTitle>
          <CardDescription>Your scheduled work hours</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No scheduled shifts at this time.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffSchedule;
