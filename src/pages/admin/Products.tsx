import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search,
  PlusCircle,
  Filter,
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductListItem {
  id: string;
  name: string;
  price: number;
  category: string;
  condition: string;
  status: string;
  barcode: string;
  date_added: string;
  featured: boolean;
  imageUrl?: string;
  product_images?: Array<{id: string, url: string, is_main: boolean}>;
}

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(id, url, is_main)')
        .order('date_added', { ascending: false });
        
      if (error) throw error;
      
      // Process the products to get the main image URL
      return data.map((product: ProductListItem) => {
        // Find the main image, or use the first image, or provide a default
        const mainImage = product.product_images?.find(img => img.is_main) || product.product_images?.[0];
        return {
          ...product,
          imageUrl: mainImage?.url || 'https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=150&auto=format&fit=crop'
        };
      });
    }
  });

  // Filter products based on search term
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'available':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500">Available</Badge>;
      case 'reserved':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">Reserved</Badge>;
      case 'sold':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500">Sold</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getConditionBadge = (condition: string) => {
    switch(condition) {
      case 'new':
        return <Badge variant="secondary">New</Badge>;
      case 'likeNew':
        return <Badge variant="secondary">Like New</Badge>;
      case 'good':
        return <Badge variant="secondary">Good</Badge>;
      case 'fair':
        return <Badge variant="secondary">Fair</Badge>;
      default:
        return <Badge variant="secondary">{condition}</Badge>;
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your inventory items</p>
          </div>
          <Button asChild>
            <Link to="/admin/products/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">Loading products...</TableCell>
                </TableRow>
              ) : filteredProducts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">No products found</TableCell>
                </TableRow>
              ) : (
                filteredProducts?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">{product.barcode}</span>
                    </TableCell>
                    <TableCell>KSh {product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{getConditionBadge(product.condition)}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" asChild>
                          <Link to={`/admin/products/${product.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {(filteredProducts?.length ?? 0) > 0 && (
            <div className="flex items-center justify-between px-4 py-2 border-t">
              <p className="text-sm text-muted-foreground">
                Showing <strong>1-{filteredProducts?.length}</strong> of <strong>{filteredProducts?.length}</strong> items
              </p>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="outline" disabled>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" disabled>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Products;
