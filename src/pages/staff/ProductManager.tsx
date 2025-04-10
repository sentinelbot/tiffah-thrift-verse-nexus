
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  PlusCircle, 
  Upload, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown,
  MoreVertical,
  Edit,
  Trash,
  Eye,
  Printer,
  Tag,
  PackageCheck,
  ImagePlus,
  Clipboard,
  Download
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock product data
const mockProducts = [
  {
    id: 'prod-001',
    name: 'Vintage Denim Jacket',
    category: 'Jackets',
    price: 2500,
    condition: 'good',
    size: 'M',
    color: 'Blue',
    status: 'available',
    dateAdded: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
  {
    id: 'prod-002',
    name: 'Floral Summer Dress',
    category: 'Dresses',
    price: 1800,
    condition: 'likeNew',
    size: 'S',
    color: 'Multicolor',
    status: 'available',
    dateAdded: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
  {
    id: 'prod-003',
    name: 'Leather Oxford Shoes',
    category: 'Shoes',
    price: 3200,
    condition: 'good',
    size: '42',
    color: 'Brown',
    status: 'reserved',
    dateAdded: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: 'prod-004',
    name: 'Cashmere Sweater',
    category: 'Sweaters',
    price: 2800,
    condition: 'likeNew',
    size: 'L',
    color: 'Gray',
    status: 'sold',
    dateAdded: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
  },
];

const ProductManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUploadingCSV, setIsUploadingCSV] = useState(false);
  
  const handleAddProduct = () => {
    setIsAddingProduct(true);
  };
  
  const handleUploadCSV = () => {
    setIsUploadingCSV(true);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Searching for: ${searchQuery}`);
  };
  
  const handleDownloadTemplate = () => {
    toast.success('CSV template downloaded');
  };

  const handlePrintBarcode = (productId: string) => {
    toast.success(`Printing barcode for product ${productId}`);
  };
  
  const handleDeleteProduct = (productId: string) => {
    toast.success(`Product ${productId} deleted`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline" className="bg-green-500/20 text-green-600">Available</Badge>;
      case 'reserved':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-600">Reserved</Badge>;
      case 'sold':
        return <Badge variant="outline" className="bg-gray-500/20 text-gray-600">Sold</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'new':
        return <Badge variant="outline" className="bg-indigo-500/20 text-indigo-600">New</Badge>;
      case 'likeNew':
        return <Badge variant="outline" className="bg-violet-500/20 text-violet-600">Like New</Badge>;
      case 'good':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-600">Good</Badge>;
      case 'fair':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600">Fair</Badge>;
      default:
        return <Badge variant="outline">{condition}</Badge>;
    }
  };

  const filteredProducts = mockProducts
    .filter(product => 
      activeTab === 'all' || 
      (activeTab === 'available' && product.status === 'available') ||
      (activeTab === 'reserved' && product.status === 'reserved') ||
      (activeTab === 'sold' && product.status === 'sold')
    )
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button onClick={handleAddProduct}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          
          <Dialog open={isUploadingCSV} onOpenChange={setIsUploadingCSV}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Products CSV</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with your product information. 
                  Make sure it follows the correct format.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <p className="mb-2 font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    CSV or Excel file (max. 10MB)
                  </p>
                  <Input
                    type="file"
                    className="hidden"
                    accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    id="csv-upload"
                  />
                  <Button size="sm" className="mx-auto" onClick={() => document.getElementById('csv-upload')?.click()}>
                    Choose File
                  </Button>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTemplate}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                  
                  <div className="text-xs text-muted-foreground text-right">
                    Need help? <a href="#" className="text-primary">View Documentation</a>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button>Upload and Process</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">150</CardTitle>
            <CardDescription>Total Products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +12 this week
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">120</CardTitle>
            <CardDescription>Available Products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              80% of inventory
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">KSh 320,500</CardTitle>
            <CardDescription>Inventory Value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Avg. KSh 2,136 per item
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="reserved">Reserved</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 sm:flex-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-9 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Category
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Price Range
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Condition
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Date Added
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <TabsContent value={activeTab} className="m-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Price
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Date Added
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center">
                          <PackageCheck className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground mb-2">No products found</p>
                          <Button size="sm" onClick={handleAddProduct}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Product
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>KSh {product.price.toLocaleString()}</TableCell>
                        <TableCell>{getConditionBadge(product.condition)}</TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell>{new Date(product.dateAdded).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrintBarcode(product.id)}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print Barcode
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ImagePlus className="mr-2 h-4 w-4" />
                                Manage Images
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Clipboard className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{filteredProducts.length}</span> of{" "}
                <span className="font-medium">{mockProducts.length}</span> products
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the details for the new product. Required fields are marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Product Name *
                </label>
                <Input id="name" placeholder="e.g. Vintage Denim Jacket" />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category *
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jackets">Jackets</SelectItem>
                    <SelectItem value="dresses">Dresses</SelectItem>
                    <SelectItem value="shoes">Shoes</SelectItem>
                    <SelectItem value="pants">Pants</SelectItem>
                    <SelectItem value="shirts">Shirts</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">
                  Price (KSh) *
                </label>
                <Input id="price" type="number" placeholder="e.g. 2500" />
              </div>
              
              <div>
                <label htmlFor="condition" className="block text-sm font-medium mb-1">
                  Condition *
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="likeNew">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="original-price" className="block text-sm font-medium mb-1">
                  Original Price (KSh)
                </label>
                <Input id="original-price" type="number" placeholder="e.g. 5000" />
              </div>
              
              <div>
                <label htmlFor="size" className="block text-sm font-medium mb-1">
                  Size
                </label>
                <Input id="size" placeholder="e.g. M, 42, One Size" />
              </div>
              
              <div>
                <label htmlFor="color" className="block text-sm font-medium mb-1">
                  Color
                </label>
                <Input id="color" placeholder="e.g. Blue, Red, Black" />
              </div>
              
              <div>
                <label htmlFor="brand" className="block text-sm font-medium mb-1">
                  Brand
                </label>
                <Input id="brand" placeholder="e.g. Levi's, H&M, Zara" />
              </div>
              
              <div className="col-span-2">
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe the product, including any notable features or defects"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Product Images
                </label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <p className="mb-2 font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    PNG, JPG or WEBP (max. 10 images, 5MB each)
                  </p>
                  <Input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    id="product-images"
                  />
                  <Button size="sm" className="mx-auto" onClick={() => document.getElementById('product-images')?.click()}>
                    Upload Images
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManager;
