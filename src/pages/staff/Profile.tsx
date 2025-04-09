
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const StaffProfile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Profile information will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffProfile;
