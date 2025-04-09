
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { Sparkles } from 'lucide-react';

interface AIProductRecommendationsProps {
  productId: string;
  category?: string;
  title?: string;
}

export function AIProductRecommendations({ 
  productId, 
  category, 
  title = "You May Also Like"
}: AIProductRecommendationsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendationType, setRecommendationType] = useState<'similar' | 'complete-look'>('similar');
  
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      return data as Product;
    },
    enabled: !!productId,
  });
  
  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ['recommendations', productId, recommendationType],
    queryFn: async () => {
      // In a real app, we would call an AI service to get recommendations
      // For demo purposes, we'll just fetch products from the same category
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category || (product?.category || ''))
        .neq('id', productId)
        .eq('status', 'available')
        .limit(4);
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!productId && (!!category || !!product?.category),
  });
  
  const generateRecommendations = async (type: 'similar' | 'complete-look') => {
    setIsGenerating(true);
    setRecommendationType(type);
    
    try {
      await refetch();
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  useEffect(() => {
    if (product) {
      generateRecommendations('similar');
    }
  }, [product]);
  
  if (isLoadingProduct) {
    return (
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-8 w-1/4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!product || (!recommendations && !isLoading)) {
    return null;
  }
  
  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={recommendationType === 'similar' ? 'default' : 'outline'}
              onClick={() => generateRecommendations('similar')}
              disabled={isGenerating}
              className="flex items-center gap-1"
            >
              <Sparkles className="h-4 w-4" />
              Similar Items
            </Button>
            <Button
              size="sm"
              variant={recommendationType === 'complete-look' ? 'default' : 'outline'}
              onClick={() => generateRecommendations('complete-look')}
              disabled={isGenerating}
              className="flex items-center gap-1"
            >
              <Sparkles className="h-4 w-4" />
              Complete the Look
            </Button>
          </div>
        </div>
        
        {isLoading || isGenerating ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : recommendations && recommendations.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.map((recommendation) => (
              <ProductCard key={recommendation.id} product={recommendation} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recommendations found. Try a different option.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
