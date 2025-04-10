
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const OrderPreparer = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Preparation</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pending Orders</CardTitle>
          <CardDescription>Orders waiting to be prepared</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No pending orders at this time.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPreparer;
