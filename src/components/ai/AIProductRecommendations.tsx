
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIProductRecommendationsProps {
  productId?: string;
  userId?: string;
  category?: string;
  recommendationType?: 'similar' | 'complete' | 'personalized' | 'trending';
  limit?: number;
}

const AIProductRecommendations = ({
  productId,
  userId,
  category,
  recommendationType = 'similar',
  limit = 4,
}: AIProductRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // In a real app, we would call a real AI service here
        // This is a mock implementation that returns products from the same category
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'available')
          .order('date_added', { ascending: false })
          .limit(limit);

        if (error) throw error;

        // Ensure data conforms to the Product type
        const typedData = data.map(item => ({
          ...item,
          status: item.status as 'available' | 'reserved' | 'sold',
          condition: item.condition as 'new' | 'likeNew' | 'good' | 'fair'
        }));

        setRecommendations(typedData);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch recommendations',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (recommendationType === 'similar' && (productId || category)) {
      fetchSimilarProducts();
    } else if (recommendationType === 'complete' && productId) {
      fetchCompleteTheLook();
    } else if (recommendationType === 'personalized' && userId) {
      fetchPersonalizedRecommendations();
    } else if (recommendationType === 'trending') {
      fetchTrendingProducts();
    }
  }, [productId, userId, category, recommendationType, limit]);

  const fetchSimilarProducts = async () => {
    setLoading(true);
    try {
      // In a real implementation, we would use AI to find similar products
      // This is a simplified mock that just gets products from the same category
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('status', 'available')
        .not('id', 'eq', productId)
        .limit(limit);

      if (error) throw error;

      // Ensure data conforms to the Product type
      const typedData = data.map(item => ({
        ...item,
        status: item.status as 'available' | 'reserved' | 'sold',
        condition: item.condition as 'new' | 'likeNew' | 'good' | 'fair'
      }));

      setRecommendations(typedData);
    } catch (error) {
      console.error('Error fetching similar products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompleteTheLook = async () => {
    setLoading(true);
    try {
      // In a real implementation, we would use AI to suggest complementary items
      // This is a simplified mock that just gets random products
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'available')
        .not('id', 'eq', productId)
        .limit(limit);

      if (error) throw error;

      // Ensure data conforms to the Product type
      const typedData = data.map(item => ({
        ...item,
        status: item.status as 'available' | 'reserved' | 'sold',
        condition: item.condition as 'new' | 'likeNew' | 'good' | 'fair'
      }));

      setRecommendations(typedData);
    } catch (error) {
      console.error('Error fetching complete the look:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalizedRecommendations = async () => {
    setLoading(true);
    try {
      // In a real implementation, we would use AI and user history for personalization
      // This is a simplified mock that just gets recent products
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'available')
        .order('date_added', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Ensure data conforms to the Product type
      const typedData = data.map(item => ({
        ...item,
        status: item.status as 'available' | 'reserved' | 'sold',
        condition: item.condition as 'new' | 'likeNew' | 'good' | 'fair'
      }));

      setRecommendations(typedData);
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingProducts = async () => {
    setLoading(true);
    try {
      // In a real implementation, we would use analytics data to determine trending items
      // This is a simplified mock that just gets featured products
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'available')
        .eq('featured', true)
        .limit(limit);

      if (error) throw error;

      // Ensure data conforms to the Product type
      const typedData = data.map(item => ({
        ...item,
        status: item.status as 'available' | 'reserved' | 'sold',
        condition: item.condition as 'new' | 'likeNew' | 'good' | 'fair'
      }));

      setRecommendations(typedData);
    } catch (error) {
      console.error('Error fetching trending products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (recommendationType) {
      case 'similar':
        return 'Similar Products';
      case 'complete':
        return 'Complete the Look';
      case 'personalized':
        return 'Recommended for You';
      case 'trending':
        return 'Trending Products';
      default:
        return 'Recommendations';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{getTitle()}</h2>
        <Button variant="link">View All</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AIProductRecommendations;
