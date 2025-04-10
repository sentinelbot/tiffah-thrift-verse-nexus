
import React, { useState, useEffect } from 'react';
import StaffLayout from '@/components/layout/StaffLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  PrinterIcon, 
  ImagePlus, 
  Edit, 
  Trash2, 
  Search, 
  Plus, 
  Wand2, 
  Loader2,
  Eye,
  Barcode,
} from 'lucide-react';
import { Product, ProductImage } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { mapDbProductToProduct, mapDbProductImageToProductImage } from '@/utils/typeMappers';
import ProductLabelPrint from '@/components/admin/printing/ProductLabelPrint';
import AIDescriptionGenerator from '@/components/ai/AIDescriptionGenerator';
import ProductPhotoUpload from '@/components/admin/products/ProductPhotoUpload';

// Define a schema for the product form
const productFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number({ invalid_type_error: "Price must be a number." }).min(0, { message: "Price must be greater than 0." }),
  originalPrice: z.number({ invalid_type_error: "Original price must be a number." }).optional(),
  category: z.string().min(2, { message: "Category must be at least 2 characters." }),
  subCategory: z.string().optional(),
  condition: z.enum(['new', 'likeNew', 'good', 'fair'], {
    required_error: "Please select a condition.",
  }),
  size: z.string().optional(),
  color: z.string().optional(),
  brand: z.string().optional(),
  barcode: z.string().optional(),
  status: z.enum(['available', 'reserved', 'sold'], {
    required_error: "Please select a status.",
  }),
  imageUrl: z.string().optional(),
  featured: z.boolean().default(false),
});

// Define the Product interface
interface ProductType {
  id: string;
  name: string;
  title?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  condition: string;
  size?: string;
  color?: string;
  brand?: string;
  barcode: string;
  status: string;
  imageUrl?: string;
  featured?: boolean;
}

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [aiGeneratedDescription, setAiGeneratedDescription] = useState<string | null>(null);
  const [aiGeneratedImages, setAiGeneratedImages] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof ProductType | null>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showHidden, setShowHidden] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isImageActionsOpen, setIsImageActionsOpen] = useState(false);
  const [isImageBulkActionsOpen, setIsImageBulkActionsOpen] = useState(false);
  const [isImageBulkDeleteConfirmOpen, setIsImageBulkDeleteConfirmOpen] = useState(false);
  const [isProductDeleteConfirmOpen, setIsProductDeleteConfirmOpen] = useState(false);
  const [isProductBulkActionsOpen, setIsProductBulkActionsOpen] = useState(false);
  const [isProductBulkDeleteConfirmOpen, setIsProductBulkDeleteConfirmOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isProductActionsOpen, setIsProductActionsOpen] = useState(false);
  
  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Function to fetch products from the database
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      
      // Map the products to our Product type
      const mappedProducts = data.map(product => mapDbProductToProduct(product));
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Sort products based on column and direction
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });
  
  // Handle product form submission (simplified for now)
  const handleSubmitProduct = async (data: z.infer<typeof productFormSchema>) => {
    // Implementation will be added in future updates
    toast.success('Product saved successfully!');
  };
  
  // Placeholder implementation of print functionality
  const handlePrintBarcode = (productId: string) => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      toast.success('Barcode sent to printer');
    }, 1500);
  };
  
  return (
    <StaffLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Product Management</h1>
            <p className="text-muted-foreground">
              Add, edit, and manage your thrift store inventory
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new product. Required fields are marked with an asterisk (*).
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {/* Product form will be implemented in future updates */}
                  <p className="text-muted-foreground">Product form coming soon...</p>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Barcode size={16} />
                  Scan Barcode
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan Product Barcode</DialogTitle>
                  <DialogDescription>
                    Use your camera to scan a product barcode or enter it manually.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {/* Barcode scanner will be implemented in future updates */}
                  <p className="text-muted-foreground">Barcode scanner coming soon...</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Products</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Barcode</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                              {product.imageUrl ? (
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <ImagePlus className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.condition} • {product.size || 'No size'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="font-mono text-xs">{product.barcode}</span>
                          </div>
                        </TableCell>
                        <TableCell>KSh {product.price}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              product.status === 'available' ? 'default' :
                              product.status === 'reserved' ? 'outline' : 'secondary'
                            }
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handlePrintBarcode(product.id)}
                            >
                              <PrinterIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsEditingProduct(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsProductDeleteConfirmOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t py-3">
            <div className="text-sm text-muted-foreground">
              Showing {sortedProducts.length} of {products.length} products
            </div>
            {/* Pagination will be implemented in future updates */}
          </CardFooter>
        </Card>
      </div>
      
      {/* Product edit dialog */}
      <Dialog open={isEditingProduct} onOpenChange={setIsEditingProduct}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details for this product. Required fields are marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {/* Edit form will be implemented in future updates */}
            <p className="text-muted-foreground">Edit form coming soon...</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingProduct(false)}>Cancel</Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Product delete confirmation dialog */}
      <Dialog open={isProductDeleteConfirmOpen} onOpenChange={setIsProductDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedProduct && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                  {selectedProduct.imageUrl ? (
                    <img 
                      src={selectedProduct.imageUrl} 
                      alt={selectedProduct.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{selectedProduct.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedProduct.barcode}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive">Delete Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* AI Product Description Generator */}
      <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>AI Description Generator</DialogTitle>
            <DialogDescription>
              Generate an optimized product description using AI.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {/* AI Description Generator will be implemented in future updates */}
            <p className="text-muted-foreground">AI Description Generator coming soon...</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAIModalOpen(false)}>Cancel</Button>
            <Button>Use Description</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StaffLayout>
  );
};

export default ProductManager;
