
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { generateUniqueBarcode } from '@/utils/barcodeUtils';
import AIDescriptionGenerator from '@/components/ai/AIDescriptionGenerator';
import AIPriceOptimizer from '@/components/ai/AIPriceOptimizer';
import AIImageEnhancer from '@/components/ai/AIImageEnhancer';
import ProductPhotoUpload from '@/components/admin/products/ProductPhotoUpload';
import { Sparkles, Camera } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  original_price: z.coerce.number().min(0, { message: 'Original price must be a positive number' }).optional(),
  barcode: z.string().optional(),
  category: z.string().min(1, { message: 'Category is required' }),
  sub_category: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  brand: z.string().optional(),
  condition: z.enum(['new', 'likeNew', 'good', 'fair'], {
    required_error: 'Please select a condition',
  }),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isMain: boolean;
}

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const isEditing = !!id;

  const [productImage, setProductImage] = useState<string>(
    "https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=600&auto=format&fit=crop"
  );
  
  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      original_price: undefined,
      barcode: '',
      category: '',
      sub_category: '',
      size: '',
      color: '',
      brand: '',
      condition: 'good',
      featured: false,
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (isEditing) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;

          if (data) {
            form.reset({
              name: data.name,
              description: data.description || '',
              price: data.price,
              original_price: data.original_price || undefined,
              barcode: data.barcode,
              category: data.category,
              sub_category: data.sub_category || '',
              size: data.size || '',
              color: data.color || '',
              brand: data.brand || '',
              condition: data.condition,
              featured: data.featured,
            });
            
            // Fetch product images
            const { data: imageData, error: imageError } = await supabase
              .from('product_images')
              .select('*')
              .eq('product_id', id)
              .order('display_order', { ascending: true });
              
            if (!imageError && imageData) {
              const images = imageData.map(img => ({
                id: img.id,
                url: img.url,
                alt: img.alt || undefined,
                isMain: img.is_main
              }));
              
              setProductImages(images);
              
              // Set main product image
              const mainImage = images.find(img => img.isMain);
              if (mainImage) {
                setProductImage(mainImage.url);
              }
            }
          }
        } catch (error: any) {
          toast.error(error.message || 'Error fetching product');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id, isEditing, form]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      if (!values.barcode) {
        values.barcode = generateUniqueBarcode();
      }

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update({
            name: values.name,
            description: values.description,
            price: values.price,
            original_price: values.original_price,
            barcode: values.barcode,
            category: values.category,
            sub_category: values.sub_category || null,
            size: values.size || null,
            color: values.color || null,
            brand: values.brand || null,
            condition: values.condition,
            featured: values.featured,
            last_updated: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
        
        // In a real implementation, we would save productImages to the database here
        
        toast.success('Product updated successfully');
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert({
            name: values.name,
            description: values.description,
            price: values.price,
            original_price: values.original_price,
            barcode: values.barcode,
            category: values.category,
            sub_category: values.sub_category || null,
            size: values.size || null,
            color: values.color || null,
            brand: values.brand || null,
            condition: values.condition,
            featured: values.featured,
            added_by: user?.id,
            status: 'available',
            inventory_tracking: {},
            measurements: {},
          })
          .select()
          .single();

        if (error) throw error;
        
        // In a real implementation, we would save productImages to the database here
        // Associate images with the new product ID (data.id)
        
        toast.success('Product created successfully');
      }

      navigate('/admin/products');
    } catch (error: any) {
      toast.error(error.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionGenerated = (description: string, keyPoints: string[], seoKeywords: string[]) => {
    form.setValue('description', description);
    console.log('Key points:', keyPoints);
    console.log('SEO keywords:', seoKeywords);
  };

  const handlePriceRecommended = (price: number) => {
    form.setValue('price', price);
  };

  const handleEnhancedImage = (enhancedUrl: string) => {
    setProductImage(enhancedUrl);
    toast.success('Enhanced image will be used for this product');
  };

  const handleBackgroundRemoved = (processedUrl: string) => {
    setProductImage(processedUrl);
    toast.success('Image with removed background will be used for this product');
  };
  
  const handleImagesChange = (images: ProductImage[]) => {
    setProductImages(images);
    
    // Update main product image if there is a main image
    const mainImage = images.find(img => img.isMain);
    if (mainImage) {
      setProductImage(mainImage.url);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update product details' : 'Create a new product in the store'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-1">
              <Camera className="h-4 w-4" />
              Product Photos
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Assistance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Basic Information</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Vintage Denim Jacket" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price (KES)</FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="original_price"
                            render={({ field: { value, onChange, ...field } }) => (
                              <FormItem>
                                <FormLabel>Original Price (KES)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={value === undefined ? '' : value}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      onChange(value === '' ? undefined : parseFloat(value));
                                    }}
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>Optional</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter product description..."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h2 className="text-xl font-semibold">Classification</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="clothing">Clothing</SelectItem>
                                  <SelectItem value="accessories">Accessories</SelectItem>
                                  <SelectItem value="footwear">Footwear</SelectItem>
                                  <SelectItem value="home">Home</SelectItem>
                                  <SelectItem value="vintage">Vintage</SelectItem>
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
                              <FormControl>
                                <Input placeholder="e.g. T-shirts, Jeans, Earrings" {...field} />
                              </FormControl>
                              <FormDescription>Optional</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="brand"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Brand</FormLabel>
                              <FormControl>
                                <Input placeholder="Brand name" {...field} />
                              </FormControl>
                              <FormDescription>Optional</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="size"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Size</FormLabel>
                              <FormControl>
                                <Input placeholder="S, M, L, XL, etc." {...field} />
                              </FormControl>
                              <FormDescription>Optional</FormDescription>
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
                                <Input placeholder="e.g. Blue, Red, Black" {...field} />
                              </FormControl>
                              <FormDescription>Optional</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h2 className="text-xl font-semibold">Other Details</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="condition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Condition</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                        <FormField
                          control={form.control}
                          name="barcode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Barcode</FormLabel>
                              <div className="flex space-x-2">
                                <FormControl>
                                  <Input
                                    placeholder="Leave empty to auto-generate"
                                    {...field}
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    const barcode = generateUniqueBarcode();
                                    form.setValue('barcode', barcode);
                                  }}
                                  className="shrink-0"
                                >
                                  Generate
                                </Button>
                              </div>
                              <FormDescription>
                                Leave empty to auto-generate on save
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Featured Product</FormLabel>
                              <FormDescription>
                                Featured products are displayed prominently on the homepage
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/admin/products')}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="photos">
            <Card>
              <CardContent className="pt-6">
                <ProductPhotoUpload
                  productId={id}
                  existingImages={productImages}
                  onImagesChange={handleImagesChange}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">AI Image Processing</h2>
                  <Separator className="my-4" />
                  
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Current Product Image</p>
                    <div className="aspect-square overflow-hidden rounded-md bg-muted/50 flex items-center justify-center">
                      <img 
                        src={productImage} 
                        alt="Product" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  
                  <AIImageEnhancer 
                    imageUrl={productImage}
                    onEnhancedImage={handleEnhancedImage}
                    onBackgroundRemoved={handleBackgroundRemoved}
                  />
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <AIDescriptionGenerator
                      name={form.getValues('name')}
                      category={form.getValues('category')}
                      condition={form.getValues('condition')}
                      originalPrice={form.getValues('original_price')}
                      brand={form.getValues('brand')}
                      color={form.getValues('color')}
                      onDescriptionGenerated={handleDescriptionGenerated}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <AIPriceOptimizer
                      condition={form.getValues('condition')}
                      category={form.getValues('category')}
                      brand={form.getValues('brand')}
                      originalPrice={form.getValues('original_price')}
                      onPriceRecommended={handlePriceRecommended}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => setActiveTab("basic")}
              >
                Back to Basic Info
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
                {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
