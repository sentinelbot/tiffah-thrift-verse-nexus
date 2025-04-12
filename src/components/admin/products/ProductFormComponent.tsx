
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ProductPhotoUpload from './ProductPhotoUpload';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent } from '@/components/ui/card';
import { getOrGenerateBarcode } from '@/utils/barcodeUtils';
import { Product, ProductFormValues, ProductCondition, ProductStatus } from '@/types/product';

// Define the schema for the form
const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  original_price: z.coerce.number().positive({ message: 'Original price must be a positive number' }).optional(),
  category: z.string().min(1, { message: 'Category is required' }),
  sub_category: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  brand: z.string().optional(),
  condition: z.enum(['new', 'likeNew', 'good', 'fair']),
  status: z.enum(['available', 'reserved', 'sold']),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

interface ProductFormComponentProps {
  productId?: string;
}

const ProductFormComponent: React.FC<ProductFormComponentProps> = ({ productId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<Partial<Product>>({});
  const [existingImages, setExistingImages] = useState<{ url: string; alt: string; isMain: boolean }[]>([]);
  const isEditMode = Boolean(productId);

  // Set up form with default values
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
      featured: false,
      added_by: user?.id || '',
    },
  });

  // Fetch product data if in edit mode
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) {
          toast.error('Error fetching product');
          console.error('Error fetching product:', error);
          return;
        }

        if (data) {
          // Convert to our Product type
          const productData: Product = {
            id: data.id,
            name: data.name,
            description: data.description,
            price: data.price,
            originalPrice: data.original_price,
            category: data.category,
            subCategory: data.sub_category,
            size: data.size,
            color: data.color,
            brand: data.brand,
            condition: data.condition as ProductCondition,
            barcode: data.barcode,
            status: data.status as ProductStatus,
            dateAdded: new Date(data.date_added),
            featured: data.featured,
            measurements: data.measurements,
            images: [],
            tags: data.tags,
            added_by: data.added_by,
          };

          setProduct(productData);

          // Set form values
          form.reset({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            original_price: productData.originalPrice || 0,
            category: productData.category,
            sub_category: productData.subCategory || '',
            size: productData.size || '',
            color: productData.color || '',
            brand: productData.brand || '',
            condition: productData.condition,
            status: productData.status,
            barcode: productData.barcode,
            featured: productData.featured,
            added_by: productData.added_by || user?.id || '',
          });

          // Fetch product images
          const { data: imageData, error: imageError } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', productId);

          if (imageError) {
            toast.error('Error fetching product images');
            console.error('Error fetching product images:', imageError);
          }

          if (imageData) {
            const formattedImages = imageData.map(img => ({
              url: img.url,
              alt: img.alt || '',
              isMain: img.is_main
            }));
            setExistingImages(formattedImages);
          }
        }
      };

      fetchProduct();
    }
  }, [productId, form, user?.id]);

  // Handle form submission
  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);

    try {
      // Generate or use existing barcode
      const barcode = await getOrGenerateBarcode(product.barcode);
      
      // Prepare product data
      const productData = {
        ...values,
        barcode,
        added_by: user?.id,
        original_price: values.original_price || null,
        sub_category: values.sub_category || null,
        measurements: {
          chest: null,
          waist: null,
          length: null,
        },
      };

      let productId: string;

      if (isEditMode) {
        // Update existing product
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (updateError) {
          throw new Error(updateError.message);
        }

        productId = product.id as string;
        toast.success('Product updated successfully');
      } else {
        // Insert new product
        const { data: newProduct, error: insertError } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();

        if (insertError || !newProduct) {
          throw new Error(insertError?.message || 'Failed to create product');
        }

        productId = newProduct.id;
        toast.success('Product created successfully');
      }

      // Handle image uploads if there are any
      if (images.length > 0) {
        // Upload each image to storage
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${productId}/${Date.now()}.${fileExt}`;
          const filePath = `products/${fileName}`;

          // Upload image to storage
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            continue;
          }

          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          // Save image info to database
          const { error: dbError } = await supabase.from('product_images').insert({
            product_id: productId,
            url: publicUrlData.publicUrl,
            alt: values.name,
            is_main: i === 0 && existingImages.length === 0, // First image is main if no existing images
          });

          if (dbError) {
            console.error('Error saving image info:', dbError);
          }
        }
      }

      // Redirect to products page
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productId || !confirm('Are you sure you want to delete this product?')) return;

    try {
      // Delete product images from storage
      // This would need a more robust implementation to delete all images

      // Delete product image records
      const { error: imageDbError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId);

      if (imageDbError) {
        throw new Error(imageDbError.message);
      }

      // Delete product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Product deleted successfully');
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
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
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the product in detail..." 
                          className="min-h-[120px]" 
                          {...field} 
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
                          <Input type="number" min="0" step="0.01" {...field} />
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
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>
                          Original retail price (if known)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Categories & Tags */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Categories & Classification</h3>
                
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
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="accessories">Accessories</SelectItem>
                            <SelectItem value="shoes">Shoes</SelectItem>
                            <SelectItem value="bags">Bags</SelectItem>
                            <SelectItem value="jewelry">Jewelry</SelectItem>
                            <SelectItem value="home">Home Goods</SelectItem>
                            <SelectItem value="vintage">Vintage</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
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
                        <FormLabel>Sub-category</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Jackets, Dresses, Hats" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Input placeholder="S, M, L, XL, etc." {...field} />
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
                          <Input placeholder="E.g., Blue, Red, Black" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Nike, Zara, Vintage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
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
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
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
                          Featured products are displayed prominently on the homepage.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Product Images */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Product Images</h3>
                <ProductPhotoUpload 
                  existingImages={existingImages}
                  onChange={setImages}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Form Actions */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </Button>
            
            <div className="space-x-2">
              {isEditMode && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteProduct}
                >
                  Delete
                </Button>
              )}
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductFormComponent;
