
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, mapSupabaseProduct } from '@/types';
import { toast } from 'sonner';

export const useProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (
    limit: number = 20,
    offset: number = 0,
    category?: string,
    search?: string
  ): Promise<Product[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('products')
        .select('*, product_images(*)')
        .order('date_added', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data.map(product => mapSupabaseProduct(product));
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      toast.error('Failed to fetch products');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchProductById = async (id: string): Promise<Product | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return mapSupabaseProduct(data);
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to fetch product');
      toast.error('Failed to fetch product');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const createProduct = async (product: Omit<Product, 'id' | 'dateAdded' | 'lastUpdated'>): Promise<Product | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Format the product data for Supabase
      const { images, ...productData } = product;
      
      // Convert measurements to JSON if needed
      const formattedProduct = {
        ...productData,
        measurements: typeof productData.measurements === 'object' 
          ? JSON.stringify(productData.measurements) 
          : productData.measurements,
        inventory_tracking: typeof productData.inventoryTracking === 'object' 
          ? JSON.stringify(productData.inventoryTracking) 
          : productData.inventoryTracking,
      };
      
      // Insert the product
      const { data, error } = await supabase
        .from('products')
        .insert([formattedProduct])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // If there are images, insert them
      if (images && images.length > 0) {
        const productImages = images.map((image, index) => ({
          product_id: data.id,
          url: image.url,
          alt: image.alt || product.name,
          is_main: index === 0, // First image is the main image
          display_order: index
        }));
        
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(productImages);
        
        if (imagesError) {
          console.error('Error inserting product images:', imagesError);
          // Continue even if image insertion fails
        }
      }
      
      toast.success('Product created successfully');
      return mapSupabaseProduct(data);
    } catch (err: any) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product');
      toast.error('Failed to create product');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Format the product data for Supabase
      const { images, ...productData } = updates;
      
      // Convert measurements to JSON if needed
      const formattedUpdates: any = {
        ...productData,
      };
      
      if (productData.measurements) {
        formattedUpdates.measurements = typeof productData.measurements === 'object' 
          ? JSON.stringify(productData.measurements) 
          : productData.measurements;
      }
      
      if (productData.inventoryTracking) {
        formattedUpdates.inventory_tracking = typeof productData.inventoryTracking === 'object' 
          ? JSON.stringify(productData.inventoryTracking) 
          : productData.inventoryTracking;
      }
      
      // Update the product
      const { data, error } = await supabase
        .from('products')
        .update(formattedUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // If there are images, handle them
      if (images && images.length > 0) {
        // First delete existing images
        const { error: deleteError } = await supabase
          .from('product_images')
          .delete()
          .eq('product_id', id);
        
        if (deleteError) {
          console.error('Error deleting product images:', deleteError);
          // Continue even if deletion fails
        }
        
        // Then insert new images
        const productImages = images.map((image, index) => ({
          product_id: id,
          url: image.url,
          alt: image.alt || data.name,
          is_main: index === 0, // First image is the main image
          display_order: index
        }));
        
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(productImages);
        
        if (imagesError) {
          console.error('Error inserting product images:', imagesError);
          // Continue even if image insertion fails
        }
      }
      
      toast.success('Product updated successfully');
      return mapSupabaseProduct(data);
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product');
      toast.error('Failed to update product');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteProduct = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Delete all images associated with the product
      const { error: imagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', id);
      
      if (imagesError) {
        console.error('Error deleting product images:', imagesError);
        // Continue even if image deletion fails
      }
      
      // Delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Product deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError(err.message || 'Failed to delete product');
      toast.error('Failed to delete product');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
