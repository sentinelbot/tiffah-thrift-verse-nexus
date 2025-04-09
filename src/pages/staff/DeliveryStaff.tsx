
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DeliveryStaff = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Delivery Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Assigned Deliveries</CardTitle>
          <CardDescription>Orders assigned for delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No deliveries assigned at this time.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryStaff;
