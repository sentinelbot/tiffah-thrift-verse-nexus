
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/products/ProductCard';
import { ProductType } from '@/context/CartContext';

interface AIProductRecommendationsProps {
  productId: string;
  category: string;
  limit?: number;
}

export const AIProductRecommendations: React.FC<AIProductRecommendationsProps> = ({ 
  productId,
  category,
  limit = 4
}) => {
  const [recommendations, setRecommendations] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!productId || !category) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Simulating API call to AI recommendation service
        // In a real app, this would call the backend AI service
        
        // Mock data for demonstration
        setTimeout(() => {
          const mockProducts: ProductType[] = [
            {
              id: 'rec1',
              title: 'Vintage Denim Jacket',
              price: 45.99,
              imageUrl: '/placeholder.svg',
              category: 'jackets',
              condition: 'excellent',
              size: 'M',
              color: 'blue',
              brand: 'Levi\'s'
            },
            {
              id: 'rec2',
              title: 'Floral Summer Dress',
              price: 28.50,
              imageUrl: '/placeholder.svg',
              category: 'dresses',
              condition: 'like-new',
              size: 'S',
              color: 'multicolor',
              brand: 'Zara'
            },
            {
              id: 'rec3',
              title: 'Leather Crossbody Bag',
              price: 35.00,
              imageUrl: '/placeholder.svg',
              category: 'accessories',
              condition: 'good',
              size: 'One Size',
              color: 'brown',
              brand: 'Coach'
            },
            {
              id: 'rec4',
              title: 'Wool Winter Coat',
              price: 89.99,
              imageUrl: '/placeholder.svg',
              category: 'outerwear',
              condition: 'excellent',
              size: 'L',
              color: 'gray',
              brand: 'H&M'
            }
          ];
          
          // Filter out the current product and limit results
          const filtered = mockProducts
            .filter(p => p.id !== productId)
            .slice(0, limit);
            
          setRecommendations(filtered);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching AI recommendations:', err);
        setError('Unable to load recommendations');
        setLoading(false);
        toast.error('Failed to load product recommendations');
      }
    };

    fetchRecommendations();
  }, [productId, category, limit]);

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-center text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">You May Also Like</h3>
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(limit).fill(0).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No recommendations available</p>
      )}
    </div>
  );
};

export default AIProductRecommendations;
