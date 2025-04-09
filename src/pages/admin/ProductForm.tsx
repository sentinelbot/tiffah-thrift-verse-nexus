
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { generateUniqueBarcode, generateBarcodeDataURL } from '@/utils/barcodeUtils';
import { ArrowLeft, Save, Plus, X, Move, Image } from 'lucide-react';
import { toast } from 'sonner';
import { ProductCategory, Product } from '@/types';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  original_price: z.coerce.number().min(0, 'Original price must be a positive number').optional(),
  category: z.string().min(1, 'Category is required'),
  sub_category: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  brand: z.string().optional(),
  condition: z.enum(['new', 'likeNew', 'good', 'fair']),
  status: z.enum(['available', 'reserved', 'sold']).default('available'),
  barcode: z.string().min(1, 'Barcode is required'),
  featured: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [barcodeImage, setBarcodeImage] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; id?: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // Fetch product categories
  const { data: categories = [] } = useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as ProductCategory[];
    }
  });
  
  // Fetch product data if editing
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id
  });
  
  // Fetch product images if editing
  const { data: productImages = [] } = useQuery({
    queryKey: ['productImages', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('display_order');
      
      if (error) throw error;
      return data.map(image => ({ url: image.url, id: image.id }));
    },
    enabled: !!id
  });
  
  // Set uploaded images from fetched product images
  useEffect(() => {
    if (productImages.length > 0) {
      setUploadedImages(productImages);
    }
  }, [productImages]);
  
  // Form setup
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      original_price: 0,
      category: '',
      sub_category: '',
      size: '',
      color: '',
      brand: '',
      condition: 'good',
      status: 'available',
      barcode: generateUniqueBarcode(),
      featured: false,
    }
  });
  
  // Update form values when product data is loaded
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description || '',
        price: product.price,
        original_price: product.original_price || 0,
        category: product.category,
        sub_category: product.sub_category || '',
        size: product.size || '',
        color: product.color || '',
        brand: product.brand || '',
        condition: product.condition,
        status: product.status,
        barcode: product.barcode,
        featured: product.featured,
      });
      
      // Generate barcode image
      setBarcodeImage(generateBarcodeDataURL(product.barcode));
    }
  }, [product, form]);
  
  // Generate barcode image when barcode value changes
  useEffect(() => {
    const barcode = form.watch('barcode');
    if (barcode) {
      setBarcodeImage(generateBarcodeDataURL(barcode));
    }
  }, [form.watch('barcode')]);
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };
  
  // Remove selected file
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Remove uploaded image
  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Upload images to Supabase storage
  const uploadImages = async (productId: string) => {
    if (selectedFiles.length === 0) return [];
    
    setUploading(true);
    const uploaded = [];
    
    try {
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${productId}/${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);
        
        if (error) throw error;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);
        
        uploaded.push(publicUrl);
      }
      
      return uploaded;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
      return [];
    } finally {
      setUploading(false);
    }
  };
  
  // Save product images to database
  const saveProductImages = async (productId: string, imageUrls: string[]) => {
    // Create new image records
    for (let i = 0; i < imageUrls.length; i++) {
      const isMain = uploadedImages.length === 0 && i === 0;
      
      const { error } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          url: imageUrls[i],
          is_main: isMain,
          display_order: uploadedImages.length + i,
        });
      
      if (error) {
        console.error('Error saving product image:', error);
        toast.error('Failed to save product image');
      }
    }
  };
  
  // Create product mutation
  const createProduct = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const { error, data: insertedProduct } = await supabase
        .from('products')
        .insert({
          ...data,
          measurements: {},
          inventory_tracking: {},
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Upload and save images
      const imageUrls = await uploadImages(insertedProduct.id);
      if (imageUrls.length > 0) {
        await saveProductImages(insertedProduct.id, imageUrls);
      }
      
      return insertedProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
      toast.success('Product created successfully');
      navigate('/admin/products');
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  });
  
  // Update product mutation
  const updateProduct = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      if (!id) throw new Error('Product ID is required');
      
      const { error, data: updatedProduct } = await supabase
        .from('products')
        .update({
          ...data,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Upload and save new images
      const imageUrls = await uploadImages(id);
      if (imageUrls.length > 0) {
        await saveProductImages(id, imageUrls);
      }
      
      return updatedProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
      queryClient.invalidateQueries({
        queryKey: ['product', id],
      });
      queryClient.invalidateQueries({
        queryKey: ['productImages', id],
      });
      toast.success('Product updated successfully');
      navigate('/admin/products');
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  });
  
  // Form submit handler
  const onSubmit = (data: ProductFormValues) => {
    if (id) {
      updateProduct.mutate(data);
    } else {
      createProduct.mutate(data);
    }
  };
  
  // Generate new barcode
  const handleGenerateBarcode = () => {
    const newBarcode = generateUniqueBarcode();
    form.setValue('barcode', newBarcode);
    setBarcodeImage(generateBarcodeDataURL(newBarcode));
  };
  
  const isSubmitting = createProduct.isPending || updateProduct.isPending || uploading;
  
  if (isLoadingProduct && id) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Loading product data...</p>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{id ? 'Edit Product' : 'Add Product'}</h1>
              <p className="text-muted-foreground">
                {id ? 'Update product information' : 'Create a new product listing'}
              </p>
            </div>
          </div>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
        
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                    <CardDescription>
                      Basic details about the product
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter product description"
                              className="min-h-24"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (KSh)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="original_price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Original Price (KSh)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormDescription>
                              If discounted, enter original price
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.filter(c => !c.parent_id).map((category) => (
                                  <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="sub_category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sub-Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value || ''}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a sub-category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories
                                  .filter(c => c.parent_id)
                                  .map((category) => (
                                    <SelectItem key={category.id} value={category.name}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Brand name (optional)"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Condition</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="likeNew">Like New</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Size (optional)"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Color (optional)"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="reserved">Reserved</SelectItem>
                              <SelectItem value="sold">Sold</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>
                      Upload up to 10 images of the product
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Label 
                        htmlFor="image-upload" 
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        <Image className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Drag & drop or click to upload</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG or WEBP (max. 5MB each)
                        </p>
                        <input 
                          id="image-upload" 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          className="hidden" 
                          onChange={handleFileSelect}
                        />
                      </Label>
                    </div>
                    
                    {/* Selected files preview */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Selected Images</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-md overflow-hidden border bg-background">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={`Selected ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeSelectedFile(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Already uploaded images */}
                    {uploadedImages.length > 0 && (
                      <div className="space-y-2 mt-6">
                        <h4 className="text-sm font-medium">Uploaded Images</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-md overflow-hidden border bg-background">
                                <img 
                                  src={image.url} 
                                  alt={`Product ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeUploadedImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="absolute top-1 left-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Move className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Barcode</CardTitle>
                    <CardDescription>
                      Unique barcode for inventory tracking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barcode</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={handleGenerateBarcode}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Generate
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {barcodeImage && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Preview:</p>
                        <div className="flex justify-center p-3 bg-white rounded-md">
                          <img src={barcodeImage} alt="Barcode" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Options</CardTitle>
                    <CardDescription>
                      Additional product settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary"
                          checked={form.watch('featured')}
                          onChange={(e) => form.setValue('featured', e.target.checked)}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        Feature this product on homepage
                      </FormLabel>
                    </FormItem>
                  </CardContent>
                </Card>
                
                <div className="hidden md:block">
                  <Button 
                    className="w-full" 
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Saving...' : 'Save Product'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

// Helper Label component for file upload
const Label = ({ 
  children, 
  className, 
  ...props 
}: React.LabelHTMLAttributes<HTMLLabelElement> & { className?: string }) => {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  );
};

export default ProductForm;
