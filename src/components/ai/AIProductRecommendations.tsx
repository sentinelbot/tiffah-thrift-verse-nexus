
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Cpu, RefreshCw } from "lucide-react";
import { getSimilarProducts, getCompleteTheLookProducts } from '@/services/aiService';
import { Product } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '../products/ProductCard';

interface AIProductRecommendationsProps {
  productId: string;
}

const AIProductRecommendations = ({ productId }: AIProductRecommendationsProps) => {
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [completeTheLookProducts, setCompleteTheLookProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadSimilarProducts = async () => {
    setIsLoadingSimilar(true);
    setError(null);
    
    try {
      const similarIds = await getSimilarProducts(productId, 4);
      
      if (similarIds.length > 0) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', similarIds);
        
        if (error) throw error;
        setSimilarProducts(data || []);
      } else {
        // Fallback: If AI service fails, load products from the same category
        const { data: currentProduct } = await supabase
          .from('products')
          .select('category')
          .eq('id', productId)
          .single();
        
        if (currentProduct) {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', currentProduct.category)
            .neq('id', productId)
            .limit(4);
          
          if (error) throw error;
          setSimilarProducts(data || []);
        }
      }
    } catch (err) {
      console.error('Error loading similar products:', err);
      setError('Failed to load similar products');
    } finally {
      setIsLoadingSimilar(false);
    }
  };

  const loadCompleteTheLookProducts = async () => {
    setIsLoadingComplete(true);
    setError(null);
    
    try {
      const completeIds = await getCompleteTheLookProducts(productId, 3);
      
      if (completeIds.length > 0) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', completeIds);
        
        if (error) throw error;
        setCompleteTheLookProducts(data || []);
      } else {
        // Fallback: If AI service fails, load products from different categories
        const { data: currentProduct } = await supabase
          .from('products')
          .select('category')
          .eq('id', productId)
          .single();
        
        if (currentProduct) {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .neq('category', currentProduct.category)
            .neq('id', productId)
            .limit(3);
          
          if (error) throw error;
          setCompleteTheLookProducts(data || []);
        }
      }
    } catch (err) {
      console.error('Error loading complete-the-look products:', err);
      setError('Failed to load complete-the-look products');
    } finally {
      setIsLoadingComplete(false);
    }
  };

  // Convert database products to ProductType for ProductCard
  const convertToProductType = (product: Product) => {
    return {
      id: product.id,
      title: product.name,
      price: product.price,
      originalPrice: product.original_price,
      category: product.category,
      condition: product.condition,
      size: product.size || undefined,
      color: product.color || undefined,
      brand: product.brand || undefined,
      // This would ideally come from product_images table
      imageUrl: "https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=600&auto=format&fit=crop"
    };
  };

  useEffect(() => {
    if (productId) {
      loadSimilarProducts();
      loadCompleteTheLookProducts();
    }
  }, [productId]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm p-2 border border-destructive/20 rounded-md bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}
      
      {/* Similar Products Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-semibold">Similar Products</h3>
          </div>
          <Button
            onClick={loadSimilarProducts}
            disabled={isLoadingSimilar}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingSimilar ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoadingSimilar ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-md mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : similarProducts.length === 0 ? (
            <div className="col-span-4 text-center p-4 border rounded-md">
              <p className="text-muted-foreground">No similar products found</p>
            </div>
          ) : (
            similarProducts.map(product => (
              <ProductCard key={product.id} product={convertToProductType(product)} />
            ))
          )}
        </div>
      </div>
      
      {/* Complete the Look Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <h3 className="text-lg font-semibold">Complete the Look</h3>
          </div>
          <Button
            onClick={loadCompleteTheLookProducts}
            disabled={isLoadingComplete}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingComplete ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoadingComplete ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-md mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : completeTheLookProducts.length === 0 ? (
            <div className="col-span-3 text-center p-4 border rounded-md">
              <p className="text-muted-foreground">No style recommendations found</p>
            </div>
          ) : (
            completeTheLookProducts.map(product => (
              <ProductCard key={product.id} product={convertToProductType(product)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AIProductRecommendations;
