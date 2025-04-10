
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShoppingCart, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample data - would be replaced with data from API
const lowStockItems = [
  { id: '1', name: 'Floral Maxi Dress', category: 'Dresses', quantity: 2, threshold: 5, lastRestocked: '2025-04-01' },
  { id: '2', name: 'Denim Jacket', category: 'Tops', quantity: 1, threshold: 3, lastRestocked: '2025-03-20' },
  { id: '3', name: 'Leather Handbag', category: 'Accessories', quantity: 1, threshold: 2, lastRestocked: '2025-03-15' },
];

const outOfStockItems = [
  { id: '4', name: 'Summer Sandals', category: 'Shoes', quantity: 0, threshold: 3, lastRestocked: '2025-02-28' },
  { id: '5', name: 'Silver Necklace', category: 'Jewelry', quantity: 0, threshold: 2, lastRestocked: '2025-03-10' },
];

const StockAlerts = () => {
  const [alertThreshold, setAlertThreshold] = useState(5);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>
                Products with inventory below threshold ({alertThreshold} items)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600">
                      {item.quantity}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.threshold}</TableCell>
                  <TableCell>{item.lastRestocked}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/products/${item.id}`}>
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Out of Stock Items
              </CardTitle>
              <CardDescription>
                Products that need immediate attention
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outOfStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.threshold}</TableCell>
                  <TableCell>{item.lastRestocked}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="flex items-center ml-auto">
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Restock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockAlerts;
