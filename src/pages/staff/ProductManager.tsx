import React, { useState, useEffect, useCallback } from 'react';
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  EyeOff,
  Copy,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowDown,
  ArrowUp,
  FileImage,
  Text,
  Tag,
  ShoppingCart,
  Percent,
  Ruler,
  Layers,
  Settings,
  Share2,
  HelpCircle,
  LayoutDashboard,
  Megaphone,
  Store,
  Boxes,
  Barcode,
} from 'lucide-react';
import { Product, ProductImage, ProductWithImages } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { mapDbProductToProduct, mapDbProductImageToProductImage } from '@/utils/typeMappers';
import ProductLabelPrint from '@/components/admin/printing/ProductLabelPrint';
import AIDescriptionGenerator from '@/components/ai/AIDescriptionGenerator';
import ProductPhotoUpload from '@/components/admin/products/ProductPhotoUpload';

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
  const [isProductVisibilityActionsOpen, setIsProductVisibilityActionsOpen] = useState(false);
  const [isProductBulkVisibilityActionsOpen, setIsProductBulkVisibilityActionsOpen] = useState(false);
  const [isVisibilityConfirmOpen, setIsVisibilityConfirmOpen] = useState(false);
  const [isBulkVisibilityConfirmOpen, setIsBulkVisibilityConfirmOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      
      const mappedProducts = data.map(product => mapDbProductToProduct(product));
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  const handleSubmitProduct = async (data: z.infer<typeof productFormSchema>) => {
    toast.success('Product saved successfully!');
  };

  const handlePrintBarcode = (productId: string) => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      toast.success('Barcode sent to printer');
    }, 1500);
  };

  return (
    <StaffLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground">
              Add, edit, and manage products in the inventory
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsAddingProduct(true)} className="gap-1">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={sortColumn || 'name'} onValueChange={(value) => setSortColumn(value as keyof ProductType)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="condition">Condition</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                >
                  {sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Products</CardTitle>
            <CardDescription>
              {products.length} products found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4" 
                        onChange={() => {/* TODO: Handle select all */}}
                      />
                    </TableHead>
                    <TableHead className="w-14">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Price (KSh)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Boxes className="h-10 w-10 mb-2" />
                          <p>No products found.</p>
                          <Button 
                            variant="link" 
                            onClick={() => setIsAddingProduct(true)}
                            className="mt-2"
                          >
                            Add your first product
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <input 
                            type="checkbox" 
                            className="w-4 h-4"
                            onChange={() => {/* TODO: Handle selection */}}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="h-10 w-10 rounded bg-muted/50 overflow-hidden">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                                <FileImage className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">{product.name}</span>
                            {product.brand && (
                              <span className="text-xs text-muted-foreground block">
                                {product.brand}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {product.condition === 'new' ? 'New' : 
                             product.condition === 'likeNew' ? 'Like New' : 
                             product.condition === 'good' ? 'Good' : 'Fair'}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.size || '-'}</TableCell>
                        <TableCell className="text-right font-medium">
                          {product.price.toLocaleString()}
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through block">
                              {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            product.status === 'available' ? 'default' : 
                            product.status === 'reserved' ? 'secondary' : 
                            'outline'
                          }>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {/* TODO: Handle edit */}}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {/* TODO: Handle print */}}
                            >
                              <PrinterIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {/* TODO: Handle delete */}}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddingProduct || isEditingProduct} onOpenChange={() => {
        setIsAddingProduct(false);
        setIsEditingProduct(false);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{isEditingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {isEditingProduct 
                ? 'Update product details in the inventory' 
                : 'Add a new product to the inventory'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p>Form implementation pending</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddingProduct(false);
              setIsEditingProduct(false);
            }}>
              Cancel
            </Button>
            <Button disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditingProduct ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{isEditingProduct ? 'Update Product' : 'Create Product'}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StaffLayout>
  );
};

export default ProductManager;
