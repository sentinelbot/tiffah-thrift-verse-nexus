
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

// Sample data - would be replaced with real data from API
const productManagersData = [
  { name: 'John', processed: 48, target: 40 },
  { name: 'Sarah', processed: 65, target: 40 },
  { name: 'Michael', processed: 38, target: 40 },
  { name: 'Emily', processed: 52, target: 40 },
];

const orderPreparersData = [
  { name: 'Alex', fulfilled: 32, target: 25 },
  { name: 'Diana', fulfilled: 28, target: 25 },
  { name: 'Robert', fulfilled: 20, target: 25 },
  { name: 'Jessica', fulfilled: 35, target: 25 },
];

const deliveryStaffData = [
  { name: 'Thomas', completed: 18, target: 15 },
  { name: 'Lisa', completed: 22, target: 15 },
  { name: 'Mark', completed: 12, target: 15 },
  { name: 'Sophie', completed: 19, target: 15 },
];

type StaffRole = 'productManager' | 'orderPreparer' | 'deliveryStaff';

export function StaffPerformance() {
  const [selectedRole, setSelectedRole] = useState<StaffRole>('productManager');
  
  const getChartData = () => {
    switch(selectedRole) {
      case 'productManager': return productManagersData;
      case 'orderPreparer': return orderPreparersData;
      case 'deliveryStaff': return deliveryStaffData;
      default: return productManagersData;
    }
  };
  
  const getDataKey = () => {
    switch(selectedRole) {
      case 'productManager': return 'processed';
      case 'orderPreparer': return 'fulfilled';
      case 'deliveryStaff': return 'completed';
      default: return 'processed';
    }
  };
  
  const getMetricLabel = () => {
    switch(selectedRole) {
      case 'productManager': return 'Products Processed';
      case 'orderPreparer': return 'Orders Fulfilled';
      case 'deliveryStaff': return 'Deliveries Completed';
      default: return 'Items Processed';
    }
  };
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Staff Performance</CardTitle>
        <CardDescription>Performance metrics by staff role</CardDescription>
        <div className="mt-4">
          <RadioGroup 
            defaultValue="productManager" 
            className="flex flex-wrap gap-4"
            value={selectedRole}
            onValueChange={(value) => setSelectedRole(value as StaffRole)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="productManager" id="productManager" />
              <Label htmlFor="productManager">Product Managers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="orderPreparer" id="orderPreparer" />
              <Label htmlFor="orderPreparer">Order Preparers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="deliveryStaff" id="deliveryStaff" />
              <Label htmlFor="deliveryStaff">Delivery Staff</Label>
            </div>
          </RadioGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getChartData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e1e1e', 
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#f5f5f5'
                }}
              />
              <Legend />
              <Bar dataKey={getDataKey()} fill="#ec4899" name={getMetricLabel()} />
              <Bar dataKey="target" fill="#9333ea" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
