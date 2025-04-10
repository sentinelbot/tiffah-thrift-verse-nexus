
import React, { useState } from 'react';
import StaffLayout from '@/components/layout/StaffLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  Package,
  Plus,
  Search,
  FileSpreadsheet,
  Upload,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Printer,
  Barcode,
  Check,
  X,
  RefreshCcw,
  Filter,
  ArrowUpDown,
} from 'lucide-react';

const ProductManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [addProductOpen, setAddProductOpen] = useState(false);
  
  // Mock categories for the product form
  const categories = [
    'Dresses', 'Jackets', 'Tops', 'Bottoms', 'Shoes', 'Bags', 'Accessories'
  ];
  
  // Mock conditions for the product form
  const conditions = [
    'New', 'Like New', 'Good', 'Fair'
  ];
  
  // Mock products data
  const products = [
    {
      id: 'PRD-001',
      name: 'Vintage Denim Jacket',
      category: 'Jackets',
      price: 2500,
      originalPrice: 4000,
      condition: 'Good',
      status: 'available',
      size: 'M',
      color: 'Blue',
      brand: 'Levi\'s',
      dateAdded: '2025-04-05',
    },
    {
      id: 'PRD-002',
      name: 'Floral Summer Dress',
      category: 'Dresses',
      price: 1800,
      originalPrice: null,
      condition: 'Like New',
      status: 'available',
      size: 'S',
      color: 'Multicolor',
      brand: 'Zara',
      dateAdded: '2025-04-06',
    },
    {
      id: 'PRD-003',
      name: 'Leather Crossbody Bag',
      category: 'Bags',
      price: 3200,
      originalPrice: 5500,
      condition: 'Good',
      status: 'reserved',
      size: 'One Size',
      color: 'Brown',
      brand: 'Coach',
      dateAdded: '2025-04-07',
    },
    {
      id: 'PRD-004',
      name: 'Classic White Sneakers',
      category: 'Shoes',
      price: 2200,
      originalPrice: null,
      condition: 'Good',
      status: 'available',
      size: '40',
      color: 'White',
      brand: 'Adidas',
      dateAdded: '2025-04-08',
    },
    {
      id: 'PRD-005',
      name: 'Wool Winter Coat',
      category: 'Jackets',
      price: 4500,
      originalPrice: 8000,
      condition: 'Like New',
      status: 'sold',
      size: 'L',
      color: 'Black',
      brand: 'H&M',
      dateAdded: '2025-04-08',
    },
  ];
  
  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Available</Badge>;
      case 'reserved':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Reserved</Badge>;
      case 'sold':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Sold</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <StaffLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Product Management</h1>
            
            <div className="flex items-center gap-2">
              <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new product. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" placeholder="Enter product name" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category.toLowerCase()}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (KSh)</Label>
                      <Input id="price" type="number" placeholder="0" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price (KSh, optional)</Label>
                      <Input id="originalPrice" type="number" placeholder="0" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.map(condition => (
                            <SelectItem key={condition} value={condition.toLowerCase().replace(' ', '')}>
                              {condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input id="brand" placeholder="Enter brand name" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="size">Size</Label>
                      <Input id="size" placeholder="Size (e.g. S, M, L, 38, etc.)" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input id="color" placeholder="Enter color" />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Enter product description" className="min-h-24" />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label>Product Images</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">Drag and drop product images here</p>
                        <p className="text-xs text-muted-foreground">or click to browse files (max 10 images)</p>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddProductOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      toast.success('Product added successfully');
                      setAddProductOpen(false);
                    }}>
                      Save Product
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="available">Available</TabsTrigger>
                <TabsTrigger value="reserved">Reserved</TabsTrigger>
                <TabsTrigger value="sold">Sold</TabsTrigger>
              </TabsList>
              
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <TabsContent value="all">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>All Products</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-3.5 w-3.5 mr-1" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
                        Sort
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Manage your product inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date Added</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center h-24">
                              <div className="flex flex-col items-center justify-center">
                                <Package className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-muted-foreground mb-2">No products found</p>
                                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>{product.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 bg-muted rounded-md"></div>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{product.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {product.brand} - {product.size}, {product.color}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>KSh {product.price.toLocaleString()}</span>
                                  {product.originalPrice && (
                                    <span className="text-xs text-muted-foreground line-through">
                                      KSh {product.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(product.status)}</TableCell>
                              <TableCell>{product.dateAdded}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Product
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Printer className="h-4 w-4 mr-2" />
                                      Print Label
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Barcode className="h-4 w-4 mr-2" />
                                      View Barcode
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {product.status === 'available' && (
                                      <DropdownMenuItem>
                                        <X className="h-4 w-4 mr-2" />
                                        Mark Unavailable
                                      </DropdownMenuItem>
                                    )}
                                    {product.status !== 'available' && (
                                      <DropdownMenuItem>
                                        <Check className="h-4 w-4 mr-2" />
                                        Mark Available
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem>
                                      <RefreshCcw className="h-4 w-4 mr-2" />
                                      Refresh Listing
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Product
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="available">
              <Card>
                <CardHeader>
                  <CardTitle>Available Products</CardTitle>
                  <CardDescription>Products that are available for purchase</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Similar table but filtered to available products */}
                  <p className="text-center py-8 text-muted-foreground">Available products will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reserved">
              <Card>
                <CardHeader>
                  <CardTitle>Reserved Products</CardTitle>
                  <CardDescription>Products that are currently reserved</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Similar table but filtered to reserved products */}
                  <p className="text-center py-8 text-muted-foreground">Reserved products will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sold">
              <Card>
                <CardHeader>
                  <CardTitle>Sold Products</CardTitle>
                  <CardDescription>Products that have been sold</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Similar table but filtered to sold products */}
                  <p className="text-center py-8 text-muted-foreground">Sold products will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StaffLayout>
  );
};

export default ProductManager;
