
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Sample data - would be replaced with real data from API
const inventoryItems = [
  { id: '1', name: 'Floral Maxi Dress', category: 'Dresses', quantity: 5, condition: 'Good', price: 2500 },
  { id: '2', name: 'Denim Jacket', category: 'Tops', quantity: 3, condition: 'Like New', price: 3500 },
  { id: '3', name: 'Leather Handbag', category: 'Accessories', quantity: 1, condition: 'Fair', price: 1800 },
  { id: '4', name: 'Summer Sandals', category: 'Shoes', quantity: 2, condition: 'Good', price: 1500 },
  { id: '5', name: 'Linen Pants', category: 'Bottoms', quantity: 4, condition: 'Like New', price: 2200 },
];

export function InventoryOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getConditionColor = (condition: string) => {
    switch(condition) {
      case 'Like New': return 'bg-green-500';
      case 'Good': return 'bg-blue-500';
      case 'Fair': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Inventory Overview</CardTitle>
        <CardDescription>Manage your product inventory</CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>Add Item</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price (KSh)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Badge className={getConditionColor(item.condition)}>
                      {item.condition}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.price.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No items found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
