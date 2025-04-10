
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Loader2,
  Tag,
  DollarSign,
  Star,
  StarOff,
} from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { toast } from 'sonner';

const Products = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      // Transform data to match Product interface
      return data.map(product => ({
        ...product,
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        originalPrice: product.original_price ? Number(product.original_price) : undefined,
        category: product.category,
        subCategory: product.sub_category,
        condition: product.condition as 'new' | 'likeNew' | 'good' | 'fair',
        barcode: product.barcode,
        status: product.status as 'available' | 'reserved' | 'sold',
        dateAdded: product.date_added ? new Date(product.date_added) : undefined,
        featured: Boolean(product.featured),
        imageUrl: '', // We'll set this externally if needed
        images: []    // Initialize as empty array
      })) as Product[];
    },
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Product deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Error deleting product');
    }
  };

  const handleFeatureToggle = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ featured: !currentFeatured })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Product ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Error toggling feature status');
    }
  };

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your inventory of products
            </p>
          </div>
          <Button onClick={() => navigate('/admin/products/new')}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
            <CardDescription>
              View, edit, and manage your products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading products...
              </div>
            ) : error ? (
              <div className="text-red-500">Error: {(error as Error).message}</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Barcode</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts?.map((product: Product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.barcode}</TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell>{product.status}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/admin/products/${product.id}`)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                navigator.clipboard.writeText(window.location.origin + `/product/${product.id}`);
                                toast.success('Product link copied to clipboard');
                              }}>
                                <Copy className="mr-2 h-4 w-4" /> Copy Link
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(product.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleFeatureToggle(product.id, product.featured)}>
                                {product.featured ? (
                                  <>
                                    <StarOff className="mr-2 h-4 w-4" /> Unfeature
                                  </>
                                ) : (
                                  <>
                                    <Star className="mr-2 h-4 w-4" /> Feature
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProducts?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Products;
