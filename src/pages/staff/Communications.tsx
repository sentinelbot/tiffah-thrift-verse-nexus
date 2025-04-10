
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const StaffCommunications = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Communications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>Your recent messages</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No messages at this time.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffCommunications;
