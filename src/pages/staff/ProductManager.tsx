
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Printer, QrCode, Tag, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage inventory and product listings</p>
        </div>
        
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" /> Add New Product
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Products</CardTitle>
            <CardDescription>Total active products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">254</div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">Available: 215</span>
              <span className="text-xs text-muted-foreground">Reserved: 39</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Added Today</CardTitle>
            <CardDescription>New products processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-2">+3 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Top Category</CardTitle>
            <CardDescription>Most common product type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">Women's Dresses</div>
            <p className="text-xs text-muted-foreground mt-2">65 items in stock</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Value</CardTitle>
            <CardDescription>Total inventory value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">KSh 285,450</div>
            <p className="text-xs text-muted-foreground mt-2">Avg. KSh 1,124 per item</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common inventory tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col justify-center">
              <QrCode className="h-8 w-8 mb-2" />
              <span>Scan Products</span>
            </Button>
            
            <Button variant="outline" className="h-24 flex flex-col justify-center">
              <Tag className="h-8 w-8 mb-2" />
              <span>Print Labels</span>
            </Button>
            
            <Button variant="outline" className="h-24 flex flex-col justify-center">
              <Upload className="h-8 w-8 mb-2" />
              <span>Bulk Upload</span>
            </Button>
            
            <Button variant="outline" className="h-24 flex flex-col justify-center">
              <Printer className="h-8 w-8 mb-2" />
              <span>Print Report</span>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recently Added Products</CardTitle>
            <CardDescription>Latest items added to inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                    <Tag className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Vintage Denim Jacket</p>
                    <p className="text-sm text-muted-foreground">Added 45 minutes ago</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">KSh 2,500</p>
                    <p className="text-xs text-muted-foreground">TTS-12345</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Items</CardTitle>
          <CardDescription>Products with limited quantities available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Barcode</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="font-medium">Men's White Shirt</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">TTS-{10000 + i}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">Men's Clothing</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right">KSh 1,200</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {i} left
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManager;
