
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const StaffTraining = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Training Resources</h1>
      <Card>
        <CardHeader>
          <CardTitle>Available Training</CardTitle>
          <CardDescription>Training materials and modules</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No training materials available at this time.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffTraining;
