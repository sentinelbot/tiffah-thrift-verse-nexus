
import React, { useState } from 'react';
import StaffLayout from '@/components/layout/StaffLayout';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Search, 
  Plus, 
  Upload, 
  Image as ImageIcon, 
  Trash, 
  Edit, 
  BarChart, 
  Tag, 
  Check, 
  X,
  FileUp,
  Sparkles,
  Wand2
} from 'lucide-react';
import { toast } from 'sonner';
import ProductLabelPrint from '@/components/admin/printing/ProductLabelPrint';
import AIDescriptionGenerator from '@/components/ai/AIDescriptionGenerator';
import AIImageEnhancer from '@/components/ai/AIImageEnhancer';
import ProductPhotoUpload from '@/components/admin/products/ProductPhotoUpload';

// Mock product data
const mockProducts = [
  {
    id: 'prod-001',
    name: 'Vintage Denim Jacket',
    category: 'Jackets',
    price: 2500,
    condition: 'good',
    size: 'M',
    brand: 'Levi\'s',
    status: 'available',
    dateAdded: '2025-04-01',
    featured: true
  },
  {
    id: 'prod-002',
    name: 'Floral Summer Dress',
    category: 'Dresses',
    price: 1800,
    condition: 'likeNew',
    size: 'S',
    brand: 'Zara',
    status: 'available',
    dateAdded: '2025-04-02',
    featured: false
  },
  {
    id: 'prod-003',
    name: 'Leather Crossbody Bag',
    category: 'Bags',
    price: 3200,
    condition: 'good',
    size: 'One Size',
    brand: 'Coach',
    status: 'reserved',
    dateAdded: '2025-04-03',
    featured: true
  },
  {
    id: 'prod-004',
    name: 'Classic White Sneakers',
    category: 'Shoes',
    price: 2200,
    condition: 'good',
    size: '42',
    brand: 'Adidas',
    status: 'sold',
    dateAdded: '2025-04-04',
    featured: false
  },
  {
    id: 'prod-005',
    name: 'Wool Winter Coat',
    category: 'Outerwear',
    price: 4500,
    condition: 'likeNew',
    size: 'L',
    brand: 'Burberry',
    status: 'available',
    dateAdded: '2025-04-05',
    featured: true
  },
];

const mockCategories = [
  { id: 'dresses', name: 'Dresses' },
  { id: 'jackets', name: 'Jackets' },
  { id: 'tops', name: 'Tops' },
  { id: 'bottoms', name: 'Bottoms' },
  { id: 'outerwear', name: 'Outerwear' },
  { id: 'shoes', name: 'Shoes' },
  { id: 'bags', name: 'Bags' },
  { id: 'accessories', name: 'Accessories' },
];

const mockConditions = [
  { value: 'new', label: 'New' },
  { value: 'likeNew', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
];

const mockSizes = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
  { value: 'One Size', label: 'One Size' },
];

const ProductManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Filter products based on search query
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsEditingProduct(true);
    setActiveTab('add-product');
  };
  
  const handleNewProduct = () => {
    setSelectedProduct(null);
    setIsEditingProduct(false);
    setActiveTab('add-product');
  };
  
  const handleSaveProduct = () => {
    toast.success(isEditingProduct ? 'Product updated successfully' : 'Product added successfully');
    setActiveTab('inventory');
    
    // Reset form after saving
    setSelectedProduct(null);
    setIsEditingProduct(false);
  };
  
  const handleGenerateBarcode = () => {
    toast.success('Barcode generated successfully');
  };
  
  const handleBulkUpload = () => {
    toast.success('CSV template downloaded. Please fill it and upload.');
  };
  
  const handleDeleteProduct = (id: string) => {
    toast.success(`Product ${id} deleted successfully`);
  };
  
  const getConditionLabel = (value: string) => {
    const condition = mockConditions.find(c => c.value === value);
    return condition ? condition.label : value;
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'reserved':
        return <Badge className="bg-amber-500">Reserved</Badge>;
      case 'sold':
        return <Badge className="bg-gray-500">Sold</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <StaffLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground">Manage inventory, add products, and track stock levels</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleNewProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button variant="outline" onClick={handleBulkUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="add-product">
              <Plus className="h-4 w-4 mr-2" />
              {isEditingProduct ? 'Edit Product' : 'Add Product'}
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Tag className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Current Inventory</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price (KSh)</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-xs">{product.id}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{getConditionLabel(product.condition)}</TableCell>
                        <TableCell>{product.size}</TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell>
                          {product.featured ? 
                            <Check className="h-4 w-4 text-green-500" /> : 
                            <X className="h-4 w-4 text-gray-400" />}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <ProductLabelPrint productId={product.id} />
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add-product" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{isEditingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
                <CardDescription>
                  {isEditingProduct 
                    ? 'Update the details of an existing product' 
                    : 'Enter the details of the new product to add to inventory'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Product Details</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input 
                        id="name" 
                        placeholder="e.g. Vintage Denim Jacket" 
                        value={selectedProduct?.name || ''}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (KSh)</Label>
                        <Input 
                          id="price" 
                          type="number" 
                          placeholder="e.g. 2500" 
                          value={selectedProduct?.price || ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="original-price">Original Price (optional)</Label>
                        <Input id="original-price" type="number" placeholder="e.g. 5000" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select defaultValue={selectedProduct?.category || ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="condition">Condition</Label>
                        <Select defaultValue={selectedProduct?.condition || ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockConditions.map((condition) => (
                              <SelectItem key={condition.value} value={condition.value}>
                                {condition.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="size">Size</Label>
                        <Select defaultValue={selectedProduct?.size || ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockSizes.map((size) => (
                              <SelectItem key={size.value} value={size.value}>
                                {size.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input 
                          id="brand" 
                          placeholder="e.g. Levi's" 
                          value={selectedProduct?.brand || ''}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <div className="flex gap-2">
                        <Textarea 
                          id="description" 
                          placeholder="Enter product description" 
                          className="flex-1"
                          value={selectedProduct?.description || ''}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Generate AI description"
                          onClick={() => setIsAIModalOpen(true)}
                        >
                          <Wand2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="featured" />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Button variant="outline" onClick={handleGenerateBarcode}>
                        Generate Barcode
                      </Button>
                      <Input 
                        placeholder="Barcode will appear here" 
                        className="font-mono" 
                        readOnly 
                        value={selectedProduct?.id || ''}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Product Images</h3>
                    
                    <Card className="border-dashed">
                      <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px]">
                        <div className="mb-4 flex flex-col items-center text-center">
                          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                          <h3 className="text-lg font-medium">Drop images here or click to upload</h3>
                          <p className="text-sm text-muted-foreground">
                            Upload up to 10 images (JPG, PNG, WebP)
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => setIsUploadModalOpen(true)}>
                            <FileUp className="h-4 w-4 mr-2" />
                            Upload Images
                          </Button>
                          <Button variant="outline" onClick={() => setIsAIModalOpen(true)}>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Enhance with AI
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="aspect-square bg-muted rounded-md flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-medium pt-2">Measurements (optional)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="chest">Chest (cm)</Label>
                        <Input id="chest" type="number" placeholder="e.g. 52" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="waist">Waist (cm)</Label>
                        <Input id="waist" type="number" placeholder="e.g. 42" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="length">Length (cm)</Label>
                        <Input id="length" type="number" placeholder="e.g. 70" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('inventory')}>Cancel</Button>
                <Button onClick={handleSaveProduct}>
                  {isEditingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>Manage product categories and sub-categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Current Categories</h3>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </div>
                  
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Products</TableHead>
                          <TableHead>Parent Category</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockCategories.map((category) => (
                          <TableRow key={category.id}>
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell>
                              {mockProducts.filter(p => p.category.toLowerCase() === category.name.toLowerCase()).length}
                            </TableCell>
                            <TableCell>—</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Analytics</CardTitle>
                <CardDescription>Track inventory performance and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{mockProducts.length}</div>
                        <p className="text-sm text-muted-foreground">Total Products</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {mockProducts.filter(p => p.status === 'available').length}
                        </div>
                        <p className="text-sm text-muted-foreground">In Stock</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {mockProducts.filter(p => p.status === 'sold').length}
                        </div>
                        <p className="text-sm text-muted-foreground">Sold This Month</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <h3 className="text-lg font-medium mb-4">Inventory by Category</h3>
                <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground">Category distribution chart will appear here</p>
                </div>
                
                <Separator className="my-6" />
                
                <h3 className="text-lg font-medium mb-4">Top Selling Products</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Days in Inventory</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Vintage Denim Jacket</TableCell>
                      <TableCell>Jackets</TableCell>
                      <TableCell>2,500</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell className="text-right">2,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Leather Crossbody Bag</TableCell>
                      <TableCell>Bags</TableCell>
                      <TableCell>3,200</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell className="text-right">3,200</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* AI Image Enhancement Dialog would be here if showing */}
      {isAIModalOpen && <AIDescriptionGenerator onClose={() => setIsAIModalOpen(false)} />}
      
      {/* Image Upload Dialog would be here if showing */}
      {isUploadModalOpen && <ProductPhotoUpload onClose={() => setIsUploadModalOpen(false)} />}
    </StaffLayout>
  );
};

export default ProductManager;
