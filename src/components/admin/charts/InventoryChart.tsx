
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Sample data - would be replaced with real data from API
const data = [
  { name: 'Dresses', inStock: 65, lowStock: 5 },
  { name: 'Tops', inStock: 45, lowStock: 8 },
  { name: 'Bottoms', inStock: 30, lowStock: 4 },
  { name: 'Accessories', inStock: 50, lowStock: 10 },
  { name: 'Shoes', inStock: 20, lowStock: 15 },
];

export function InventoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Status</CardTitle>
        <CardDescription>Current inventory levels by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
              <Bar dataKey="inStock" fill="#10b981" name="In Stock" />
              <Bar dataKey="lowStock" fill="#ef4444" name="Low Stock" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
